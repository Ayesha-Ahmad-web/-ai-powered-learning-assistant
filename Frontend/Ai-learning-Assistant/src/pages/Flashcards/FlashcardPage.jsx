import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FlashcardPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped]       = useState(false);
  const navigate                    = useNavigate();

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const user  = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      const response = await fetch('http://localhost:8000/api/flashcards', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setFlashcards(data);
      } else {
        toast.error(data.message || 'Failed to load flashcards');
      }
    } catch (err) {
      console.error('Flashcards error:', err);
      toast.error('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flashcard set?')) return;
    try {
      const user  = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      const response = await fetch(`http://localhost:8000/api/flashcards/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setFlashcards(prev => prev.filter(f => f._id !== id));
        if (selected?._id === id) setSelected(null);
        toast.success('Flashcard set deleted');
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleFavorite = async (flashcardId, cardIndex) => {
    try {
      const user  = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      const response = await fetch(
        `http://localhost:8000/api/flashcards/${flashcardId}/card/${cardIndex}/favorite`,
        {
          method:  'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setFlashcards(prev => prev.map(f => f._id === updated._id ? updated : f));
        setSelected(updated);
      }
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  const nextCard = () => {
    setCurrentIndex(i => (i + 1) % selected.cards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex(i => (i - 1 + selected.cards.length) % selected.cards.length);
    setFlipped(false);
  };

  const openStudy = (fc) => {
    setSelected(fc);
    setCurrentIndex(0);
    setFlipped(false);
  };

  // ─── Loading ───
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: 'calc(100vh - 64px)',
      color: 'var(--accent)', fontFamily: 'Syne', fontSize: '1.2rem',
    }}>
      Loading flashcards...
    </div>
  );

  // ─── Study Mode ───
  if (selected) {
    const card = selected.cards[currentIndex];
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <button
          onClick={() => setSelected(null)}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--accent-light)', cursor: 'pointer',
            marginBottom: '1.5rem', fontFamily: 'Syne',
            fontWeight: 600, fontSize: '0.95rem',
          }}
        >
          ← Back to all sets
        </button>

        <div className="card">
          <h2 style={{
            fontFamily: 'Syne', fontWeight: 700,
            fontSize: '1.2rem', marginBottom: '0.25rem',
          }}>
            {selected.title}
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem', marginBottom: '1.5rem',
          }}>
            {selected.cards.length} cards ·{' '}
            {selected.cards.filter(c => c.isFavorite).length} favorited
          </p>

          {/* Progress */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '0.75rem',
          }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Card {currentIndex + 1} of {selected.cards.length}
            </span>
            <button
              onClick={() => handleToggleFavorite(selected._id, currentIndex)}
              style={{
                background: 'transparent', border: 'none',
                cursor: 'pointer', fontSize: '1.3rem',
              }}
            >
              {card.isFavorite ? '⭐' : '☆'}
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '4px', background: 'var(--bg-secondary)',
            borderRadius: '2px', marginBottom: '1.5rem',
          }}>
            <div style={{
              height: '100%',
              width: `${((currentIndex + 1) / selected.cards.length) * 100}%`,
              background: 'var(--accent)', borderRadius: '2px',
              transition: 'width 0.3s',
            }} />
          </div>

          {/* Flip Card */}
          <div
            onClick={() => setFlipped(!flipped)}
            style={{
              width: '100%', height: '200px',
              cursor: 'pointer', perspective: '1000px',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{
              width: '100%', height: '100%',
              position: 'relative', transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              {/* Front */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '1.5rem',
              }}>
                <span style={{
                  color: 'var(--accent)', fontSize: '0.75rem',
                  fontFamily: 'Syne', fontWeight: 700,
                  letterSpacing: '0.1em', marginBottom: '1rem',
                }}>
                  QUESTION
                </span>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {card.question}
                </p>
                <span style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem', marginTop: '1rem',
                }}>
                  Click to reveal answer
                </span>
              </div>

              {/* Back */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent)',
                borderRadius: '12px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '1.5rem',
              }}>
                <span style={{
                  color: 'var(--success)', fontSize: '0.75rem',
                  fontFamily: 'Syne', fontWeight: 700,
                  letterSpacing: '0.1em', marginBottom: '1rem',
                }}>
                  ANSWER
                </span>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                  {card.answer}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={prevCard}
              style={{
                flex: 1, padding: '0.75rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '10px', cursor: 'pointer',
                fontFamily: 'Syne', fontWeight: 600,
              }}
            >
              ← Previous
            </button>
            <button
              onClick={nextCard}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Next →
            </button>
          </div>

          {/* Card Navigator */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            gap: '0.5rem', marginTop: '1.25rem',
          }}>
            {selected.cards.map((c, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setFlipped(false); }}
                style={{
                  width: '34px', height: '34px',
                  borderRadius: '8px',
                  background: i === currentIndex
                    ? 'var(--accent)'
                    : c.isFavorite
                    ? 'rgba(245,158,11,0.2)'
                    : 'var(--bg-secondary)',
                  border: `1px solid ${
                    i === currentIndex
                      ? 'var(--accent)'
                      : c.isFavorite
                      ? 'var(--warning)'
                      : 'var(--border)'
                  }`,
                  color: i === currentIndex ? 'white'
                    : c.isFavorite ? 'var(--warning)'
                    : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'Syne', fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── List Mode ───
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'Syne', fontWeight: 800,
          fontSize: '2rem', marginBottom: '0.25rem',
        }}>
          Flashcards
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {flashcards.length} set{flashcards.length !== 1 ? 's' : ''}
        </p>
      </div>

      {flashcards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🃏</div>
          <h2 style={{
            fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.5rem',
          }}>
            No flashcards yet
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Open a document and generate flashcards from the Flashcards tab
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/documents')}
          >
            Go to Documents
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {flashcards.map(fc => (
            <div
              key={fc._id}
              className="card"
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
                <div style={{ fontSize: '1.8rem' }}>🃏</div>
                <button
                  onClick={() => handleDelete(fc._id)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: 'var(--text-secondary)', cursor: 'pointer',
                    fontSize: '1rem', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >
                  🗑️
                </button>
              </div>

              <h3 style={{
                fontFamily: 'Syne', fontWeight: 700,
                marginBottom: '0.5rem', fontSize: '0.95rem',
              }}>
                {fc.title}
              </h3>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem', marginBottom: '0.25rem',
              }}>
                {fc.document?.title || 'Unknown document'}
              </p>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem', marginBottom: '1rem',
              }}>
                {fc.cards.length} cards ·{' '}
                ⭐ {fc.cards.filter(c => c.isFavorite).length} favorites
              </p>

              <button
                className="btn-primary"
                onClick={() => openStudy(fc)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                Study Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;