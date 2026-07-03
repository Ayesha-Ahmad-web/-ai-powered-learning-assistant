import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id }   = useParams();
  const result   = location.state;

  if (!result) {
    navigate('/');
    return null;
  }

  const { score, total, answers, questions } = result;
  const percentage = Math.round((score / total) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!',      color: 'var(--success)',      icon: '🏆' };
    if (percentage >= 75) return { label: 'Great job!',      color: 'var(--accent-light)', icon: '🎯' };
    if (percentage >= 60) return { label: 'Good effort!',    color: 'var(--warning)',      icon: '👍' };
    return                       { label: 'Keep practicing!',color: 'var(--danger)',       icon: '💪' };
  };

  const grade = getGrade();

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Score Card */}
      <div className="card" style={{
        textAlign: 'center', marginBottom: '2rem',
        border: `1px solid ${grade.color}40`,
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
          {grade.icon}
        </div>
        <h1 style={{
          fontFamily: 'Syne', fontWeight: 800,
          fontSize: '2.5rem', marginBottom: '0.25rem',
          color: grade.color,
        }}>
          {percentage}%
        </h1>
        <p style={{
          fontFamily: 'Syne', fontWeight: 700,
          fontSize: '1.2rem', marginBottom: '0.5rem',
        }}>
          {grade.label}
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          You scored {score} out of {total} questions
        </p>
      </div>

      {/* Question Breakdown */}
      <h2 style={{
        fontFamily: 'Syne', fontWeight: 700,
        fontSize: '1.3rem', marginBottom: '1.25rem',
      }}>
        Question Breakdown
      </h2>

      <div style={{
        display: 'flex', flexDirection: 'column',
        gap: '1rem', marginBottom: '2rem',
      }}>
        {questions.map((q, i) => {
          const isCorrect = answers[i] === q.correctAnswer;
          return (
            <div
              key={i}
              className="card"
              style={{
                borderColor: isCorrect
                  ? 'rgba(34,211,160,0.3)'
                  : 'rgba(255,90,126,0.3)',
              }}
            >
              {/* Question */}
              <div style={{
                display: 'flex', gap: '0.75rem',
                alignItems: 'flex-start', marginBottom: '0.75rem',
              }}>
                <span style={{ fontSize: '1.2rem' }}>
                  {isCorrect ? '✅' : '❌'}
                </span>
                <p style={{
                  fontFamily: 'Syne', fontWeight: 600,
                  fontSize: '0.95rem', lineHeight: 1.5,
                }}>
                  {i + 1}. {q.question}
                </p>
              </div>

              {/* Answers */}
              <div style={{ paddingLeft: '2rem' }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.25rem',
                }}>
                  Your answer:{' '}
                  <span style={{
                    color: isCorrect ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 600,
                  }}>
                    {answers[i] || 'Not answered'}
                  </span>
                </p>

                {!isCorrect && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem',
                  }}>
                    Correct answer:{' '}
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                      {q.correctAnswer}
                    </span>
                  </p>
                )}

                {q.explanation && (
                  <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px', padding: '0.75rem',
                    marginTop: '0.5rem', fontSize: '0.85rem',
                    color: 'var(--text-secondary)', lineHeight: 1.6,
                  }}>
                    💡 {q.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate(`/quiz/${id}`)}
          style={{
            flex: 1, padding: '0.8rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            borderRadius: '10px', cursor: 'pointer',
            fontFamily: 'Syne', fontWeight: 600,
          }}
        >
          ← Retake Quiz
        </button>
        <button
          className="btn-primary"
          onClick={() => navigate('/documents')}
          style={{ flex: 1, padding: '0.8rem' }}
        >
          Back to Documents
        </button>
      </div>
    </div>
  );
};

export default QuizResultPage;