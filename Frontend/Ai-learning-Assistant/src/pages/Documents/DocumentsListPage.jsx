import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import documentService from '../../services/documentService';
import UploadModal from '../../components/UploadModal';
import toast from 'react-hot-toast';

const DocumentCard = ({ document, onDelete }) => {
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      className="card fade-in"
      style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 30px var(--accent-glow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '1rem',
      }}>
        <div style={{
          background: 'var(--accent-glow)',
          border: '1px solid var(--border)',
          borderRadius: '10px', padding: '0.75rem', fontSize: '1.5rem',
        }}>
          📄
        </div>
        <button
          onClick={() => onDelete(document._id)}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontSize: '1.1rem', padding: '0.25rem', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--danger)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          title="Delete"
        >
          🗑️
        </button>
      </div>

      <h3 style={{
        fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
        marginBottom: '0.5rem', overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {document.title}
      </h3>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          {formatSize(document.filesize)}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          {formatDate(document.createdAt)}
        </span>
      </div>

      <Link to={`/documents/${document._id}`} style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>
          Open Document →
        </button>
      </Link>
    </div>
  );
};

const DocumentsListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await documentService.getAll();
      setDocuments(data);
    } catch (err) {
      toast.error('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await documentService.delete(id);
      setDocuments(prev => prev.filter(d => d._id !== id));
      toast.success('Document deleted');
    } catch (err) {
      toast.error('Failed to delete document');
      console.error(err);
    }
  };

  const handleUploaded = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const filtered = documents.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: 'calc(100vh - 64px)',
    }}>
      <div style={{ color: 'var(--accent)', fontFamily: 'Syne', fontSize: '1.2rem' }}>
        Loading documents...
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '2rem',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Syne', fontWeight: 800,
            fontSize: '2rem', marginBottom: '0.25rem',
          }}>
            Documents
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowUpload(true)}
          style={{ fontSize: '0.95rem' }}
        >
          + Upload PDF
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          className="input"
          type="text"
          placeholder="🔍  Search documents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📂</div>
          <h2 style={{
            fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.5rem',
          }}>
            {search ? 'No documents found' : 'No documents yet'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {search
              ? 'Try a different search term'
              : 'Upload your first PDF to get started'}
          </p>
          {!search && (
            <button
              className="btn-primary"
              onClick={() => setShowUpload(true)}
            >
              Upload PDF
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {filtered.map(doc => (
            <DocumentCard
              key={doc._id}
              document={doc}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  );
};

export default DocumentsListPage;