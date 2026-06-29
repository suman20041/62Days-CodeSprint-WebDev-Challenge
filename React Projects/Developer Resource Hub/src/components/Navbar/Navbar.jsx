import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/" className="navbar__logo">
          Developer Resource Hub
        </Link>
      </div>
      <div className="navbar__actions">
        <ThemeToggle />
      </div>
    </nav>
  );
}
