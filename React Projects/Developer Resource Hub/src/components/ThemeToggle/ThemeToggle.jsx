import { useEffect } from 'react';
import useTheme from '../../hooks/useTheme';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // optional: sync toggle UI with theme attribute
  useEffect(() => {}, [theme]);

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? '🌞' : '🌜'}
    </button>
  );
}
