import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/documents', label: 'Documents' },
    { path: '/flashcards', label: 'Flashcards' },
  ];

  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem',
          background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚡ LearnAI</span>
      </Link>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {navLinks.map(link => (
          <Link key={link.path} to={link.path} style={{
            color: location.pathname === link.path ? 'var(--accent-light)' : 'var(--text-secondary)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: location.pathname === link.path ? 'var(--accent-glow)' : 'transparent',
            fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
          }}>{link.label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/profile" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontFamily: 'Syne' }}>
          {user?.name}
        </Link>
        <button onClick={handleLogout} style={{
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', padding: '0.4rem 1rem',
          borderRadius: '8px', cursor: 'pointer', fontFamily: 'Syne', fontSize: '0.85rem', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--danger)'; e.target.style.color = 'var(--danger)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
        >Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;