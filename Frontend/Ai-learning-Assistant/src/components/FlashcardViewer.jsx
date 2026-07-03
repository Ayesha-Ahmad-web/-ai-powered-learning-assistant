import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FlashcardViewer = ({ flashcard, onUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped]           = useState(false);

  if (!flashcard || !flashcard.cards || flashcard.cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        No cards available
      </div>
    );
  }

  const cards = flashcard.cards;
  const card  = cards[currentIndex];

  const next = () => {
    setCurrentIndex(i => (i + 1) % cards.length);
    setFlipped(false);
  };

  const prev = () => {
    setCurrentIndex(i => (i - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  const handleFavorite = async () => {
    try {
      const user  = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      const response = await fetch(
        `http://localhost:8000/api/flashcards/${flashcard._id}/card/${currentIndex}/favorite`,
        {
          method:  'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const updated = await response.json();
        if (onUpdate) onUpdate(updated);
      }
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1rem',
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Card {currentIndex + 1} of {cards.length}
        </span>
        <button
          onClick={handleFavorite}
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
          width: `${((currentIndex + 1) / cards.length) * 100}%`,
          background: 'var(--accent)', borderRadius: '2px',
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Flip Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          width: '100%', height: '220px',
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
          {/* Front — Question */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--bg-card)',
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
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              {card.question}
            </p>
            <span style={{
              color: 'var(--text-secondary)',
              fontSize: '0.75rem', marginTop: '1rem',
            }}>
              Click to reveal answer
            </span>
          </div>

          {/* Back — Answer */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
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
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={prev}
          style={{
            flex: 1, padding: '0.75rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            borderRadius: '10px', cursor: 'pointer',
            fontFamily: 'Syne', fontWeight: 600,
            fontSize: '0.95rem', transition: 'all 0.2s',
          }}
        >
          ← Previous
        </button>
        <button
          onClick={next}
          className="btn-primary"
          style={{ flex: 1, fontSize: '0.95rem' }}
        >
          Next →
        </button>
      </div>

      {/* Card Navigator */}
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        gap: '0.5rem', marginTop: '1.25rem',
      }}>
        {cards.map((c, i) => (
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
              fontSize: '0.8rem', transition: 'all 0.2s',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default FlashcardViewer;