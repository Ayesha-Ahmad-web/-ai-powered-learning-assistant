import React, { useState } from 'react';
import documentService from '../services/documentService.js';
import toast from 'react-hot-toast';

const UploadModal = ({ onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      const { data } = await documentService.upload(formData);
      toast.success('Document uploaded successfully!');
      onUploaded(data);
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setError('');
    } else {
      setError('Only PDF files are allowed');
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Only PDF files are allowed');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}>
      <div className="card fade-in" style={{
        width: '100%', maxWidth: '480px', margin: '1rem',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.3rem' }}>
            Upload Document
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--text-secondary)', fontSize: '1.5rem',
              cursor: 'pointer', lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Title input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              color: 'var(--text-secondary)', fontSize: '0.85rem',
              fontFamily: 'Syne', fontWeight: 600,
            }}>
              DOCUMENT TITLE (optional)
            </label>
            <input
              className="input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter document title..."
            />
          </div>

          {/* File drop zone */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              color: 'var(--text-secondary)', fontSize: '0.85rem',
              fontFamily: 'Syne', fontWeight: 600,
            }}>
              PDF FILE *
            </label>
            <div
              onClick={() => document.getElementById('file-input').click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: file
                  ? 'var(--accent-glow)'
                  : dragOver
                  ? 'rgba(108,99,255,0.05)'
                  : 'transparent',
              }}
              onMouseEnter={e => {
                if (!file) e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={e => {
                if (!file) e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                {file ? '✅' : '📂'}
              </div>
              {file ? (
                <>
                  <p style={{
                    color: 'var(--accent-light)',
                    fontSize: '0.9rem', fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}>
                    {file.name}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    Click to select or drag & drop
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    PDF files only · Max 10MB
                  </p>
                </>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Error */}
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

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '0.7rem',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                borderRadius: '10px', cursor: 'pointer',
                fontFamily: 'Syne', fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadModal;