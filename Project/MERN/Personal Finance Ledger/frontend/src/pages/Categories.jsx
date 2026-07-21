import { useEffect, useState } from 'react';
import client from '../api/client.js';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', kind: 'expense', color: '#e8590c' });
  const [error, setError] = useState('');

  const load = () => client.get('/categories').then((res) => setCategories(res.data));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/categories', form);
      setForm({ name: '', kind: 'expense', color: '#e8590c' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this category?')) return;
    await client.delete(`/categories/${id}`);
    load();
  };

  return (
    <div className="container">
      <div className="card">
        <h2>New category</h2>
        <form onSubmit={submit} className="grid cols-3">
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Kind</label>
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="expense">expense</option>
              <option value="income">income</option>
            </select>
          </div>
          <div className="field">
            <label>Color</label>
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
          <button className="btn" type="submit">Add category</button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="card">
        <h2>Categories</h2>
        <table>
          <thead><tr><th>Name</th><th>Kind</th><th>Color</th><th></th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.kind}</td>
                <td><span style={{ background: c.color, padding: '0.15rem 0.6rem', borderRadius: 6 }}>&nbsp;</span></td>
                <td><button className="btn danger" onClick={() => remove(c._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
