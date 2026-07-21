import { useEffect, useState } from 'react';
import client from '../api/client.js';
import ConflictModal from '../components/ConflictModal.jsx';
import { enqueueMutation } from '../utils/offlineQueue.js';

const emptyEntry = () => ({ account: '', category: '', direction: 'debit', amount: '' });

function EntryRows({ entries, setEntries, accounts, categories }) {
  const update = (idx, field, value) => {
    const next = entries.slice();
    next[idx] = { ...next[idx], [field]: value };
    setEntries(next);
  };
  const remove = (idx) => setEntries(entries.filter((_, i) => i !== idx));

  return (
    <div>
      {entries.map((entry, idx) => (
        <div className="entry-row" key={idx}>
          <div className="field" style={{ margin: 0 }}>
            <label>Account</label>
            <select value={entry.account} onChange={(e) => update(idx, 'account', e.target.value)} required>
              <option value="">Select...</option>
              {accounts.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Category</label>
            <select value={entry.category} onChange={(e) => update(idx, 'category', e.target.value)}>
              <option value="">None</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Direction</label>
            <select value={entry.direction} onChange={(e) => update(idx, 'direction', e.target.value)}>
              <option value="debit">debit</option>
              <option value="credit">credit</option>
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              value={entry.amount}
              onChange={(e) => update(idx, 'amount', e.target.value)}
              required
            />
          </div>
          <button type="button" className="btn danger" onClick={() => remove(idx)} disabled={entries.length <= 2}>
            &times;
          </button>
        </div>
      ))}
      <button type="button" className="btn secondary" onClick={() => setEntries([...entries, emptyEntry()])}>
        + Add entry
      </button>
    </div>
  );
}

function balanceDiff(entries) {
  const debit = entries.reduce((s, e) => (e.direction === 'debit' ? s + Number(e.amount || 0) : s), 0);
  const credit = entries.reduce((s, e) => (e.direction === 'credit' ? s + Number(e.amount || 0) : s), 0);
  return { debit, credit, balanced: Math.round(debit * 100) === Math.round(credit * 100) };
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState([emptyEntry(), emptyEntry()]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editEntries, setEditEntries] = useState([]);
  const [editMemo, setEditMemo] = useState('');
  const [conflict, setConflict] = useState(null); // { mine, theirs }

  const load = () => {
    client.get('/transactions').then((res) => setTransactions(res.data.items));
    client.get('/accounts').then((res) => setAccounts(res.data));
    client.get('/categories').then((res) => setCategories(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const { debit, credit, balanced } = balanceDiff(entries);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!balanced) {
      setError(`Entries are not balanced (debit ${debit.toFixed(2)} vs credit ${credit.toFixed(2)})`);
      return;
    }
    const payload = {
      date,
      memo,
      entries: entries.map((en) => ({ ...en, category: en.category || null, amount: Number(en.amount) })),
    };

    // Optimistic UI: show the pending transaction immediately.
    const tempId = `temp-${Date.now()}`;
    const optimistic = { _id: tempId, ...payload, version: 0, pending: true };
    setTransactions((prev) => [optimistic, ...prev]);
    setMemo('');
    setEntries([emptyEntry(), emptyEntry()]);

    if (!navigator.onLine) {
      enqueueMutation({ method: 'post', url: '/transactions', data: payload, description: `Add: ${memo}` });
      return;
    }

    try {
      const res = await client.post('/transactions', payload);
      setTransactions((prev) => prev.map((t) => (t._id === tempId ? res.data : t)));
    } catch (err) {
      setTransactions((prev) => prev.filter((t) => t._id !== tempId));
      setError(err.response?.data?.message || 'Failed to save transaction');
    }
  };

  const startEdit = (tx) => {
    setEditingId(tx._id);
    setEditMemo(tx.memo);
    setEditEntries(
      tx.entries.map((e) => ({
        account: e.account?._id || e.account,
        category: e.category?._id || e.category || '',
        direction: e.direction,
        amount: e.amount,
      }))
    );
  };

  const saveEdit = async (tx, forceVersion) => {
    const payload = {
      version: forceVersion ?? tx.version,
      memo: editMemo,
      entries: editEntries.map((en) => ({ ...en, category: en.category || null, amount: Number(en.amount) })),
    };

    const previous = transactions;
    setTransactions((prev) => prev.map((t) => (t._id === tx._id ? { ...t, ...payload, entries: payload.entries } : t)));
    setEditingId(null);

    if (!navigator.onLine) {
      enqueueMutation({ method: 'put', url: `/transactions/${tx._id}`, data: payload, description: `Edit: ${editMemo}` });
      return;
    }

    try {
      const res = await client.put(`/transactions/${tx._id}`, payload);
      setTransactions((prev) => prev.map((t) => (t._id === tx._id ? res.data : t)));
    } catch (err) {
      if (err.response?.status === 409) {
        setConflict({ mine: { ...tx, ...payload }, theirs: err.response.data.current });
        setTransactions(previous);
      } else {
        setTransactions(previous);
        alert(err.response?.data?.message || 'Failed to update transaction');
      }
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    const previous = transactions;
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    try {
      await client.delete(`/transactions/${id}`);
    } catch (err) {
      setTransactions(previous);
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="container">
      {conflict && (
        <ConflictModal
          mine={conflict.mine}
          theirs={conflict.theirs}
          onCancel={() => setConflict(null)}
          onUseTheirs={() => {
            setTransactions((prev) => prev.map((t) => (t._id === conflict.theirs._id ? conflict.theirs : t)));
            setConflict(null);
          }}
          onKeepMine={async (serverVersion) => {
            setConflict(null);
            await saveEdit(conflict.mine, serverVersion);
          }}
        />
      )}

      <div className="card">
        <h2>New transaction</h2>
        <form onSubmit={submit}>
          <div className="grid cols-2">
            <div className="field">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Memo</label>
              <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="e.g. Grocery run" />
            </div>
          </div>
          <EntryRows entries={entries} setEntries={setEntries} accounts={accounts} categories={categories} />
          <p className={balanced ? 'text-dim' : 'error-text'}>
            Debit total: {debit.toFixed(2)} · Credit total: {credit.toFixed(2)} {balanced ? '(balanced)' : '(not balanced yet)'}
          </p>
          {error && <p className="error-text">{error}</p>}
          <button className="btn" type="submit">Save transaction</button>
        </form>
      </div>

      <div className="card">
        <h2>Transactions</h2>
        <table>
          <thead><tr><th>Date</th><th>Memo</th><th>Entries</th><th></th></tr></thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} style={{ opacity: tx.pending ? 0.6 : 1 }}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>
                  {editingId === tx._id ? (
                    <input value={editMemo} onChange={(e) => setEditMemo(e.target.value)} />
                  ) : (
                    <>{tx.memo} {tx.pending && <span className="badge">syncing...</span>}</>
                  )}
                </td>
                <td>
                  {editingId === tx._id ? (
                    <EntryRows entries={editEntries} setEntries={setEditEntries} accounts={accounts} categories={categories} />
                  ) : (
                    tx.entries.map((e, i) => (
                      <div key={i}>
                        <span className={`badge ${e.direction}`}>{e.direction}</span>{' '}
                        {e.account?.name || e.account} — ${Number(e.amount).toFixed(2)}
                      </div>
                    ))
                  )}
                </td>
                <td style={{ display: 'flex', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                  {editingId === tx._id ? (
                    <>
                      <button className="btn" onClick={() => saveEdit(tx)}>Save</button>
                      <button className="btn secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn secondary" onClick={() => startEdit(tx)} disabled={tx.pending}>Edit</button>
                      <button className="btn danger" onClick={() => remove(tx._id)} disabled={tx.pending}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
