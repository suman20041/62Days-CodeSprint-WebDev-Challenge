import { useEffect, useState } from 'react';
import client from '../api/client.js';

const emptyEntry = () => ({ account: '', category: '', direction: 'debit', amount: '' });

export default function Recurring() {
  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [memo, setMemo] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [nextRunDate, setNextRunDate] = useState(new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState([emptyEntry(), emptyEntry()]);
  const [error, setError] = useState('');
  const [runResult, setRunResult] = useState(null);

  const load = () => {
    client.get('/recurring').then((res) => setBills(res.data));
    client.get('/accounts').then((res) => setAccounts(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const updateEntry = (idx, field, value) => {
    const next = entries.slice();
    next[idx] = { ...next[idx], [field]: value };
    setEntries(next);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/recurring', {
        memo,
        frequency,
        nextRunDate,
        entries: entries.map((en) => ({ ...en, category: en.category || null, amount: Number(en.amount) })),
      });
      setMemo('');
      setEntries([emptyEntry(), emptyEntry()]);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recurring bill');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this recurring bill?')) return;
    await client.delete(`/recurring/${id}`);
    load();
  };

  const toggleActive = async (bill) => {
    await client.put(`/recurring/${bill._id}`, { active: !bill.active });
    load();
  };

  const runDue = async () => {
    const res = await client.post('/recurring/run-due');
    setRunResult(res.data);
    load();
  };

  return (
    <div className="container">
      <div className="card">
        <h2>New recurring bill</h2>
        <p className="text-dim">
          Recurring bills post a balanced transaction automatically each time they fall due. Use "Run due bills"
          below to simulate a scheduler tick.
        </p>
        <form onSubmit={submit}>
          <div className="grid cols-3">
            <div className="field">
              <label>Memo</label>
              <input value={memo} onChange={(e) => setMemo(e.target.value)} required />
            </div>
            <div className="field">
              <label>Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
              </select>
            </div>
            <div className="field">
              <label>Next run date</label>
              <input type="date" value={nextRunDate} onChange={(e) => setNextRunDate(e.target.value)} />
            </div>
          </div>
          {entries.map((entry, idx) => (
            <div className="entry-row" key={idx}>
              <div className="field" style={{ margin: 0 }}>
                <label>Account</label>
                <select value={entry.account} onChange={(e) => updateEntry(idx, 'account', e.target.value)} required>
                  <option value="">Select...</option>
                  {accounts.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Direction</label>
                <select value={entry.direction} onChange={(e) => updateEntry(idx, 'direction', e.target.value)}>
                  <option value="debit">debit</option>
                  <option value="credit">credit</option>
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Amount</label>
                <input type="number" step="0.01" value={entry.amount} onChange={(e) => updateEntry(idx, 'amount', e.target.value)} required />
              </div>
            </div>
          ))}
          {error && <p className="error-text">{error}</p>}
          <button className="btn" type="submit">Create recurring bill</button>
        </form>
      </div>

      <div className="card">
        <div className="flex-between">
          <h2>Recurring bills</h2>
          <button className="btn secondary" onClick={runDue}>Run due bills now</button>
        </div>
        {runResult && (
          <p className="text-dim">Ran {runResult.ranCount} bill(s) and created matching transactions.</p>
        )}
        <table>
          <thead><tr><th>Memo</th><th>Frequency</th><th>Next run</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill._id}>
                <td>{bill.memo}</td>
                <td>{bill.frequency}</td>
                <td>{new Date(bill.nextRunDate).toLocaleDateString()}</td>
                <td>{bill.active ? 'Active' : 'Paused'}</td>
                <td style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="btn secondary" onClick={() => toggleActive(bill)}>
                    {bill.active ? 'Pause' : 'Resume'}
                  </button>
                  <button className="btn danger" onClick={() => remove(bill._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
