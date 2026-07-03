import { Link } from 'react-router-dom';

const DocumentCard = ({ document, onDelete }) => {
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="card fade-in" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px var(--accent-glow)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ background: 'var(--accent-glow)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem', fontSize: '1.5rem' }}>📄</div>
        <button onClick={() => onDelete(document._id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = 'var(--danger)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
        >🗑️</button>
      </div>
      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {document.title}
      </h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{formatSize(document.filesize)}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{formatDate(document.createdAt)}</span>
      </div>
      <Link to={`/documents/${document._id}`} style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>Open Document →</button>
      </Link>
    </div>
  );
};

export default DocumentCard;