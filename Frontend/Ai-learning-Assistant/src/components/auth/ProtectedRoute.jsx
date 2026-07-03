import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ color: 'var(--accent)', fontFamily: 'Syne', fontSize: '1.5rem' }}>Loading...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;