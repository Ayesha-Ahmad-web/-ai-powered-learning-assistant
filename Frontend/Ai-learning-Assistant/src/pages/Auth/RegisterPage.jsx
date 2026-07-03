import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      authLogin(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        position: 'fixed', bottom: '-20%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="card fade-in" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧠</div>
          <h1 style={{
            fontFamily: 'Syne', fontWeight: 800,
            fontSize: '1.8rem', marginBottom: '0.5rem',
          }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Start your AI-powered learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              color: 'var(--text-secondary)', fontSize: '0.85rem',
              fontFamily: 'Syne', fontWeight: 600,
            }}>
              FULL NAME
            </label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              color: 'var(--text-secondary)', fontSize: '0.85rem',
              fontFamily: 'Syne', fontWeight: 600,
            }}>
              EMAIL
            </label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              color: 'var(--text-secondary)', fontSize: '0.85rem',
              fontFamily: 'Syne', fontWeight: 600,
            }}>
              PASSWORD
            </label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              color: 'var(--text-secondary)', fontSize: '0.85rem',
              fontFamily: 'Syne', fontWeight: 600,
            }}>
              CONFIRM PASSWORD
            </label>
            <input
              className="input"
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,90,126,0.1)',
              border: '1px solid rgba(255,90,126,0.3)',
              color: 'var(--danger)',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '1.5rem',
          color: 'var(--text-secondary)', fontSize: '0.9rem',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--accent-light)',
            textDecoration: 'none', fontWeight: 600,
          }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;