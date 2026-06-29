import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/bookmarks', label: 'Bookmarks' },
  { to: '/progress', label: 'Progress' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
