import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import client from '../api/client.js';

const COLORS = ['#2f9e44', '#e8590c', '#1971c2', '#f08c00', '#c92a2a', '#5c940d', '#495057'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get('/reports/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load summary'));
  }, []);

  if (error) return <div className="container error-text">{error}</div>;
  if (!summary) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="container">
      <div className="grid cols-3 mb-1">
        <div className="card stat">
          <span className="label">Net worth (assets − liabilities)</span>
          <span className={`value ${summary.netWorth >= 0 ? 'positive' : 'negative'}`}>
            ${summary.netWorth.toFixed(2)}
          </span>
        </div>
        <div className="card stat">
          <span className="label">Accounts tracked</span>
          <span className="value">{summary.balances.length}</span>
        </div>
        <div className="card stat">
          <span className="label">Months of activity</span>
          <span className="value">{summary.monthly.length}</span>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3>Account balances</h3>
          <table>
            <thead>
              <tr><th>Account</th><th>Type</th><th>Balance</th></tr>
            </thead>
            <tbody>
              {summary.balances.map((b) => (
                <tr key={b.accountId}>
                  <td>{b.name}</td>
                  <td>{b.type}</td>
                  <td>${b.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Expenses by category</h3>
          {summary.expenseByCategory.length === 0 ? (
            <p className="text-dim">No expense transactions yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={summary.expenseByCategory}
                  dataKey="total"
                  nameKey="category"
                  outerRadius={90}
                  label={(d) => d.category}
                >
                  {summary.expenseByCategory.map((entry, idx) => (
                    <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card mt-1">
        <h3>Monthly income vs. expense</h3>
        {summary.monthly.length === 0 ? (
          <p className="text-dim">No dated transactions yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a4038" />
              <XAxis dataKey="month" stroke="#9fb8ac" />
              <YAxis stroke="#9fb8ac" />
              <Tooltip contentStyle={{ background: '#16241f', border: '1px solid #2a4038' }} />
              <Legend />
              <Bar dataKey="income" fill="#2f9e44" />
              <Bar dataKey="expense" fill="#e8590c" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
