import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const QuizTakePage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [quiz, setQuiz]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [answers, setAnswers]   = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const user     = JSON.parse(localStorage.getItem('user') || '{}');
      const token    = user?.token;
      const response = await fetch(`http://localhost:8000/api/quizzes/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setQuiz(data);
      } else {
        toast.error(data.message || 'Failed to load quiz');
        navigate('/');
      }
    } catch (err) {
      console.error('Quiz error:', err);
      toast.error('Failed to load quiz');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    setAnswers(prev => ({ ...prev, [currentQ]: option }));
  };

  const handleSubmit = async () => {
    const answersArray = quiz.questions.map((_, i) => answers[i] || '');
    setSubmitting(true);
    try {
      const user     = JSON.parse(localStorage.getItem('user') || '{}');
      const token    = user?.token;
      const response = await fetch(`http://localhost:8000/api/quizzes/${id}/submit`, {
        method:  'POST',
        headers: {
          'Authorization':  `Bearer ${token}`,
          'Content-Type':   'application/json',
        },
        body: JSON.stringify({ answers: answersArray }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/quiz/${id}/result`, { state: data });
      } else {
        toast.error(data.message || 'Failed to submit quiz');
      }
    } catch (err) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: 'calc(100vh - 64px)',
      color: 'var(--accent)', fontFamily: 'Syne', fontSize: '1.2rem',
    }}>
      Loading quiz...
    </div>
  );

  if (!quiz) return null;

  const q       = quiz.questions[currentQ];
  const totalQ  = quiz.questions.length;
  const answered = Object.keys(answers).length;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent', border: 'none',
          color: 'var(--text-secondary)', cursor: 'pointer',
          fontSize: '0.9rem', marginBottom: '1.5rem',
          fontFamily: 'Syne',
        }}
      >
        ← Back
      </button>

      {/* Header */}
      <h1 style={{
        fontFamily: 'Syne', fontWeight: 800,
        fontSize: '1.7rem', marginBottom: '0.5rem',
      }}>
        {quiz.title}
      </h1>

      {/* Progress Info */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '0.5rem',
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Question {currentQ + 1} of {totalQ} · {answered} answered
        </p>
        <span style={{
          color: 'var(--accent-light)', fontSize: '0.85rem',
          fontFamily: 'Syne', fontWeight: 600,
        }}>
          {Math.round((answered / totalQ) * 100)}% complete
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '4px', background: 'var(--bg-secondary)',
        borderRadius: '2px', marginBottom: '1.5rem',
      }}>
        <div style={{
          height: '100%',
          width: `${((currentQ + 1) / totalQ) * 100}%`,
          background: 'var(--accent)', borderRadius: '2px',
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Question Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p style={{
          fontFamily: 'Syne', fontWeight: 600,
          fontSize: '1.1rem', lineHeight: 1.6,
          marginBottom: '1.5rem',
        }}>
          {q.question}
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {q.options.map((opt, i) => {
            const isSelected = answers[currentQ] === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '1rem 1.25rem',
                  background: isSelected ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  color:  isSelected ? 'var(--accent-light)' : 'var(--text-primary)',
                  borderRadius: '10px', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'DM Sans',
                  fontSize: '0.95rem', lineHeight: 1.5,
                  transition: 'all 0.2s', display: 'flex',
                  alignItems: 'center', gap: '0.75rem',
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <span style={{
                  width: '28px', height: '28px',
                  borderRadius: '7px', flexShrink: 0,
                  background: isSelected ? 'var(--accent)' : 'rgba(108,99,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: '0.8rem',
                  color: isSelected ? 'white' : 'var(--accent-light)',
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            style={{
              padding: '0.7rem 1.25rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              borderRadius: '10px', cursor: 'pointer',
              fontFamily: 'Syne', fontWeight: 600,
              opacity: currentQ === 0 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setCurrentQ(q => Math.min(totalQ - 1, q + 1))}
            disabled={currentQ === totalQ - 1}
            className="btn-primary"
            style={{ opacity: currentQ === totalQ - 1 ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>

        {answered === totalQ && (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ background: 'var(--success)', fontSize: '0.95rem' }}
          >
            {submitting ? 'Submitting...' : '✓ Submit Quiz'}
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div style={{
        marginTop: '1.5rem', display: 'flex',
        flexWrap: 'wrap', gap: '0.5rem',
      }}>
        {quiz.questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            style={{
              width: '36px', height: '36px',
              borderRadius: '8px',
              background: i === currentQ
                ? 'var(--accent)'
                : answers[i]
                ? 'rgba(34,211,160,0.2)'
                : 'var(--bg-secondary)',
              border: `1px solid ${
                i === currentQ
                  ? 'var(--accent)'
                  : answers[i]
                  ? 'var(--success)'
                  : 'var(--border)'
              }`,
              color: i === currentQ
                ? 'white'
                : answers[i]
                ? 'var(--success)'
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

export default QuizTakePage;