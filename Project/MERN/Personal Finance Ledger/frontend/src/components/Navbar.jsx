import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="navbar">
      <div className="brand">💰 Finance Ledger</div>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/accounts">Accounts</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/recurring">Recurring</NavLink>
        <NavLink to="/reports">Reports</NavLink>
      </nav>
      <button
        className="btn secondary"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        Log out ({user.name})
      </button>
    </header>
  );
}
