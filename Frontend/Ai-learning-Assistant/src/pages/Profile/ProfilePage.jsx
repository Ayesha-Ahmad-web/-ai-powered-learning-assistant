import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg]         = useState('');
  const [pwError, setPwError]     = useState('');
  const [pwForm, setPwForm]       = useState({
    currentPassword: '',
    newPassword: '',
    confirm: '',
  });

  useEffect(() => {
    authService.getProfile()
      .then(res => setProfile(res.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError('Passwords do not match');
      return;
    }
    setPwLoading(true);
    setPwMsg('');
    setPwError('');
    try {
      await authService.updatePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg('Password updated successfully!');
      toast.success('Password updated!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      setPwError(msg);
      toast.error(msg);
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: 'calc(100vh - 64px)',
    }}>
      <div style={{ color: 'var(--accent)', fontFamily: 'Syne' }}>
        Loading profile...
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', marginBottom: '2rem' }}>
        Profile
      </h1>

      {/* User Info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: 'white',
          }}>
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.25rem' }}>
              {profile?.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              {profile?.email}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Member since{' '}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                    month: 'long', year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
          Change Password
        </h2>
        <form onSubmit={handlePasswordUpdate}>
          {[
            { key: 'currentPassword', label: 'CURRENT PASSWORD' },
            { key: 'newPassword',     label: 'NEW PASSWORD'     },
            { key: 'confirm',         label: 'CONFIRM PASSWORD' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block', marginBottom: '0.5rem',
                color: 'var(--text-secondary)', fontSize: '0.8rem',
                fontFamily: 'Syne', fontWeight: 600,
              }}>
                {field.label}
              </label>
              <input
                className="input"
                type="password"
                value={pwForm[field.key]}
                onChange={e => setPwForm({ ...pwForm, [field.key]: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
          ))}

          {pwMsg && (
            <div style={{
              background: 'rgba(34,211,160,0.1)',
              border: '1px solid rgba(34,211,160,0.3)',
              color: 'var(--success)', padding: '0.75rem 1rem',
              borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem',
            }}>
              ✅ {pwMsg}
            </div>
          )}

          {pwError && (
            <div style={{
              background: 'rgba(255,90,126,0.1)',
              border: '1px solid rgba(255,90,126,0.3)',
              color: 'var(--danger)', padding: '0.75rem 1rem',
              borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem',
            }}>
              {pwError}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={pwLoading}>
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;