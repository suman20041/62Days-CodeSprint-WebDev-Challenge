import { useEffect, useState } from 'react';
import client from '../api/client.js';

const TYPES = ['asset', 'liability', 'income', 'expense', 'equity'];

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'asset', openingBalance: 0, currency: 'USD' });
  const [error, setError] = useState('');

  const load = () => client.get('/accounts').then((res) => setAccounts(res.data));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/accounts', { ...form, openingBalance: Number(form.openingBalance) });
      setForm({ name: '', type: 'asset', openingBalance: 0, currency: 'USD' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this account?')) return;
    try {
      await client.delete(`/accounts/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const toggleArchive = async (account) => {
    await client.put(`/accounts/${account._id}`, { archived: !account.archived });
    load();
  };

  return (
    <div className="container">
      <div className="card">
        <h2>New account</h2>
        <form onSubmit={submit} className="grid cols-3">
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Opening balance</label>
            <input
              type="number"
              step="0.01"
              value={form.openingBalance}
              onChange={(e) => setForm({ ...form, openingBalance: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">Add account</button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="card">
        <h2>Accounts</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Balance</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a._id}>
                <td>{a.name}</td>
                <td>{a.type}</td>
                <td>${a.balance?.toFixed(2)}</td>
                <td>{a.archived ? 'Archived' : 'Active'}</td>
                <td style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="btn secondary" onClick={() => toggleArchive(a)}>
                    {a.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button className="btn danger" onClick={() => remove(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
