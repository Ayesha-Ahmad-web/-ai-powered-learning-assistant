import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card" style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div style={{
      fontFamily: 'Syne', fontWeight: 700,
      fontSize: '5rem', color: color || 'var(--text-primary)',
      marginBottom: '0.25rem',
    }}>
      {value}
    </div>
    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{label}</div>
  </div>
);

const activityIcon = (type) => ({
  document: '📄',
  flashcard: '🃏',
  quiz: '🧪',
}[type] || '📌');

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getOverview();
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: 'calc(100vh - 64px)',
    }}>
      <div style={{ color: 'var(--accent)', fontFamily: 'Syne', fontSize: '1.2rem' }}>
        Loading dashboard...
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontFamily: 'Syne', fontWeight: 700,
          fontSize: '3rem', marginBottom: '0.5rem',
        }}>
          Welcome back,{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--accent-light), #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {user?.name}
          </span>{' '}👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here's your learning overview
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <StatCard
          icon="📚"
          label="Documents"
          value={data?.stats?.totalDocuments || 0}
          color="var(--accent-light)"
        />
        <StatCard
          icon="🃏"
          label="Flashcard Sets"
          value={data?.stats?.totalFlashcardSets || 0}
          color="var(--success)"
        />
        <StatCard
          icon="📝"
          label="Total Cards"
          value={data?.stats?.totalFlashcards || 0}
          color="var(--warning)"
        />
        <StatCard
          icon="🧪"
          label="Quizzes"
          value={data?.stats?.totalQuizzes || 0}
          color="#f472b6"
        />
      </div>

      {/* Recent Documents + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Recent Documents */}
        <div className="card">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '1.25rem',
          }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>
              Recent Documents
            </h2>
            <Link to="/documents" style={{
              color: 'var(--accent-light)', textDecoration: 'none',
              fontSize: '0.85rem', fontFamily: 'Syne', fontWeight: 600,
            }}>
              View all →
            </Link>
          </div>

          {!data?.recentDocuments?.length ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
              <p>No documents yet</p>
              <Link to="/documents" style={{
                color: 'var(--accent-light)',
                textDecoration: 'none', fontSize: '0.85rem',
              }}>
                Upload your first PDF →
              </Link>
            </div>
          ) : (
            data.recentDocuments.map(doc => (
              <Link
                key={doc._id}
                to={`/documents/${doc._id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: '0.75rem', padding: '0.75rem',
                  borderRadius: '10px', marginBottom: '0.5rem',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-glow)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '1.3rem' }}>📄</span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{
                      color: 'var(--text-primary)', fontSize: '0.9rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {doc.title}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 style={{
            fontFamily: 'Syne', fontWeight: 700,
            fontSize: '1.1rem', marginBottom: '1.25rem',
          }}>
            Recent Activity
          </h2>

          {!data?.recentActivity?.length ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <p>No activity yet. Start learning!</p>
            </div>
          ) : (
            data.recentActivity.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                gap: '0.75rem', padding: '0.75rem 0',
                borderBottom: i < data.recentActivity.length - 1
                  ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{activityIcon(item.type)}</span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{
                    color: 'var(--text-primary)', fontSize: '0.9rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.title}
                  </p>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem', textTransform: 'capitalize',
                  }}>
                    {item.type} · {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{
          fontFamily: 'Syne', fontWeight: 700,
          fontSize: '1.1rem', marginBottom: '1.25rem',
        }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { icon: '📄', label: 'Upload PDF',      path: '/documents',  color: 'var(--accent)'  },
            { icon: '🃏', label: 'View Flashcards', path: '/flashcards', color: 'var(--success)' },
            { icon: '👤', label: 'Edit Profile',    path: '/profile',    color: 'var(--warning)' },
          ].map(action => (
            <Link key={action.path} to={action.path} style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${action.color}30`,
                color: action.color,
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'Syne', fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = `${action.color}15`}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              >
                {action.icon} {action.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;