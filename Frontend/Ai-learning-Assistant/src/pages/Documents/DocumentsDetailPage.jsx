import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DocumentDetailPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const chatEndRef = useRef(null);

  const [document,  setDocument]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState('chat');

  const [messages,    setMessages]    = useState([]);
  const [chatInput,   setChatInput]   = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [summary,        setSummary]        = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [concept,        setConcept]        = useState('');
  const [explanation,    setExplanation]    = useState('');
  const [explainLoading, setExplainLoading] = useState(false);

  const [flashcardSets,  setFlashcardSets]  = useState([]);
  const [flashcardCount, setFlashcardCount] = useState(10);
  const [generatingFC,   setGeneratingFC]   = useState(false);
  const [selectedFC,     setSelectedFC]     = useState(null);
  const [fcFlipped,      setFcFlipped]      = useState(false);
  const [fcIndex,        setFcIndex]        = useState(0);

  const [quizSets,      setQuizSets]      = useState([]);
  const [quizCount,     setQuizCount]     = useState(5);
  const [generatingQuiz,setGeneratingQuiz]= useState(false);

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.token || '';
  };

  const authHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type':  'application/json',
  });

  useEffect(() => {
    loadAll();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadAll = async () => {
    try {
      const [docRes, fcRes, chatRes] = await Promise.all([
        fetch(`http://localhost:8000/api/documents/${id}`,              { headers: authHeaders() }),
        fetch(`http://localhost:8000/api/flashcards/document/${id}`,    { headers: authHeaders() }),
        fetch(`http://localhost:8000/api/ai/chat/${id}`,                { headers: authHeaders() }),
      ]);
      const docData  = await docRes.json();
      const fcData   = await fcRes.json();
      const chatData = await chatRes.json();

      if (docRes.ok)  {
        setDocument(docData);
        if (docData.summary) setSummary(docData.summary);
      } else {
        toast.error('Document not found');
        navigate('/documents');
        return;
      }
      if (fcRes.ok)   setFlashcardSets(fcData);
      if (chatRes.ok) setMessages(Array.isArray(chatData) ? chatData : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    try {
      const res  = await fetch('http://localhost:8000/api/ai/chat', {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ documentId: id, message: msg }),
      });
      const data = await res.json();
      if (res.ok) setMessages(data.chatHistory);
      else        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSummary = async () => {
    setSummaryLoading(true);
    try {
      const res  = await fetch('http://localhost:8000/api/ai/summary', {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ documentId: id }),
      });
      const data = await res.json();
      if (res.ok) setSummary(data.summary);
      else toast.error(data.message || 'Failed to generate summary');
    } catch { toast.error('Failed to generate summary'); }
    finally  { setSummaryLoading(false); }
  };

  const handleExplain = async () => {
    if (!concept.trim()) return;
    setExplainLoading(true);
    setExplanation('');
    try {
      const res  = await fetch('http://localhost:8000/api/ai/explain', {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ documentId: id, concept }),
      });
      const data = await res.json();
      if (res.ok) setExplanation(data.explanation);
      else toast.error(data.message || 'Failed');
    } catch { toast.error('Failed to explain'); }
    finally  { setExplainLoading(false); }
  };

  const handleGenerateFlashcards = async () => {
    setGeneratingFC(true);
    try {
      const res  = await fetch('http://localhost:8000/api/ai/flashcards', {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ documentId: id, count: flashcardCount }),
      });
      const data = await res.json();
      if (res.ok) {
        setFlashcardSets(prev => [data, ...prev]);
        setSelectedFC(data);
        setFcIndex(0);
        setFcFlipped(false);
        toast.success('Flashcards generated!');
      } else {
        toast.error(data.message || 'Failed to generate flashcards');
      }
    } catch { toast.error('Failed'); }
    finally  { setGeneratingFC(false); }
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const res  = await fetch('http://localhost:8000/api/ai/quiz', {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ documentId: id, count: quizCount }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuizSets(prev => [data, ...prev]);
        toast.success('Quiz generated!');
      } else {
        toast.error(data.message || 'Failed to generate quiz');
      }
    } catch { toast.error('Failed'); }
    finally  { setGeneratingQuiz(false); }
  };

  const tabs = [
    { key: 'chat',       label: '💬 Chat'       },
    { key: 'ai',         label: '🤖 AI Actions' },
    { key: 'flashcards', label: '🃏 Flashcards' },
    { key: 'quizzes',    label: '🧪 Quizzes'    },
  ];

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: 'calc(100vh - 64px)',
      color: 'var(--accent)', fontFamily: 'Syne',
    }}>
      Loading document...
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/documents')}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Syne',
          }}
        >
          ← Back to Documents
        </button>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.7rem' }}>
          {document?.title}
        </h1>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Left — PDF Viewer */}
        <div style={{
          background: '#0d0d16',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          overflow: 'hidden',
          height: '75vh',
        }}>
          <div style={{
            background: '#1a1a28', padding: '8px 12px',
            borderBottom: '1px solid var(--border)',
            fontSize: '12px', color: 'var(--text-secondary)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>{document?.filename}</span>
            <span>PDF Viewer</span>
          </div>
          <iframe
            src={`http://localhost:8000/uploads/${document?.filename}`}
            style={{ width: '100%', height: 'calc(100% - 36px)', border: 'none' }}
            title="PDF Viewer"
          />
        </div>

        {/* Right — Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '75vh' }}>

          {/* Tab Buttons */}
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '0.5rem 0.9rem',
                  background: tab === t.key ? 'var(--accent)' : 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color:  tab === t.key ? 'white' : 'var(--text-secondary)',
                  borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Syne', fontWeight: 600,
                  fontSize: '0.8rem', transition: 'all 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="card" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* ── CHAT TAB ── */}
            {tab === 'chat' && (
              <>
                <div style={{
                  flex: 1, overflow: 'auto',
                  display: 'flex', flexDirection: 'column',
                  gap: '0.75rem', marginBottom: '1rem',
                }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
                      <p>Ask anything about this document!</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf:    m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth:     '85%',
                        background:   m.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                        color:        'var(--text-primary)',
                        padding:      '0.75rem 1rem',
                        borderRadius: m.role === 'user'
                          ? '16px 16px 4px 16px'
                          : '16px 16px 16px 4px',
                        fontSize: '0.9rem', lineHeight: 1.5,
                      }}
                    >
                      {m.content}
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{
                      alignSelf: 'flex-start',
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem', padding: '0.5rem 1rem',
                    }}>
                      AI is thinking...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="input"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    placeholder="Ask about this document..."
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn-primary"
                    onClick={sendChat}
                    disabled={chatLoading}
                  >
                    Send
                  </button>
                </div>
              </>
            )}

            {/* ── AI ACTIONS TAB ── */}
            {tab === 'ai' && (
              <div style={{ overflow: 'auto' }}>

                {/* Summary */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '1rem',
                  }}>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700 }}>
                      📋 Document Summary
                    </h3>
                    <button
                      className="btn-primary"
                      onClick={handleSummary}
                      disabled={summaryLoading}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
                    >
                      {summaryLoading ? 'Generating...' : summary ? 'Regenerate' : 'Generate'}
                    </button>
                  </div>
                  {summary ? (
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px', padding: '1rem',
                      fontSize: '0.9rem', lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {summary}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Click Generate to create an AI summary.
                    </p>
                  )}
                </div>

                {/* Explain Concept */}
                <div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '1rem' }}>
                    🔍 Explain Concept
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                      className="input"
                      value={concept}
                      onChange={e => setConcept(e.target.value)}
                      placeholder="Enter a concept to explain..."
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn-primary"
                      onClick={handleExplain}
                      disabled={explainLoading}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      {explainLoading ? '...' : 'Explain'}
                    </button>
                  </div>
                  {explanation && (
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px', padding: '1rem',
                      fontSize: '0.9rem', lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {explanation}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── FLASHCARDS TAB ── */}
            {tab === 'flashcards' && (
              <div style={{ overflow: 'auto' }}>
                <div style={{
                  display: 'flex', gap: '0.75rem',
                  marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
                }}>
                  <select
                    value={flashcardCount}
                    onChange={e => setFlashcardCount(Number(e.target.value))}
                    className="input"
                    style={{ width: 'auto' }}
                  >
                    {[5, 10, 15, 20].map(n => (
                      <option key={n} value={n}>{n} cards</option>
                    ))}
                  </select>
                  <button
                    className="btn-primary"
                    onClick={handleGenerateFlashcards}
                    disabled={generatingFC}
                  >
                    {generatingFC ? 'Generating...' : '⚡ Generate Flashcards'}
                  </button>
                </div>

                {flashcardSets.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                    No flashcards yet. Generate your first set!
                  </p>
                ) : selectedFC ? (
                  <>
                    <button
                      onClick={() => setSelectedFC(null)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: 'var(--accent-light)', cursor: 'pointer',
                        marginBottom: '1rem', fontFamily: 'Syne', fontWeight: 600,
                      }}
                    >
                      ← All sets
                    </button>

                    {/* Mini Flashcard Viewer */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '0.5rem',
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Card {fcIndex + 1} of {selectedFC.cards.length}
                      </span>
                    </div>

                    <div
                      onClick={() => setFcFlipped(!fcFlipped)}
                      style={{
                        height: '160px', cursor: 'pointer',
                        perspective: '1000px', marginBottom: '1rem',
                      }}
                    >
                      <div style={{
                        width: '100%', height: '100%',
                        position: 'relative', transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s',
                        transform: fcFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0,
                          backfaceVisibility: 'hidden',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center',
                          textAlign: 'center', padding: '1rem',
                        }}>
                          <span style={{ color: 'var(--accent)', fontSize: '0.7rem', fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.75rem' }}>QUESTION</span>
                          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{selectedFC.cards[fcIndex].question}</p>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.75rem' }}>Click to flip</span>
                        </div>
                        <div style={{
                          position: 'absolute', inset: 0,
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          background: 'var(--accent-glow)',
                          border: '1px solid var(--accent)',
                          borderRadius: '10px',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center',
                          textAlign: 'center', padding: '1rem',
                        }}>
                          <span style={{ color: 'var(--success)', fontSize: '0.7rem', fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.75rem' }}>ANSWER</span>
                          <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{selectedFC.cards[fcIndex].answer}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => { setFcIndex(i => (i - 1 + selectedFC.cards.length) % selectedFC.cards.length); setFcFlipped(false); }}
                        style={{ flex: 1, padding: '0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600 }}
                      >← Prev</button>
                      <button
                        onClick={() => { setFcIndex(i => (i + 1) % selectedFC.cards.length); setFcFlipped(false); }}
                        className="btn-primary"
                        style={{ flex: 1 }}
                      >Next →</button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {flashcardSets.map(fc => (
                      <div key={fc._id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>{fc.title}</p>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{fc.cards.length} cards</p>
                        </div>
                        <button
                          className="btn-primary"
                          onClick={() => { setSelectedFC(fc); setFcIndex(0); setFcFlipped(false); }}
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                        >
                          Study
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── QUIZZES TAB ── */}
            {tab === 'quizzes' && (
              <div style={{ overflow: 'auto' }}>
                <div style={{
                  display: 'flex', gap: '0.75rem',
                  marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
                }}>
                  <select
                    value={quizCount}
                    onChange={e => setQuizCount(Number(e.target.value))}
                    className="input"
                    style={{ width: 'auto' }}
                  >
                    {[3, 5, 10, 15].map(n => (
                      <option key={n} value={n}>{n} questions</option>
                    ))}
                  </select>
                  <button
                    className="btn-primary"
                    onClick={handleGenerateQuiz}
                    disabled={generatingQuiz}
                  >
                    {generatingQuiz ? 'Generating...' : '🧪 Generate Quiz'}
                  </button>
                </div>

                {quizSets.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                    No quizzes yet. Generate your first quiz!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {quizSets.map(quiz => (
                      <div
                        key={quiz._id}
                        className="card"
                        style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <div>
                          <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>
                            {quiz.title}
                          </p>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {quiz.questions.length} questions
                          </p>
                        </div>
                        <button
                          className="btn-primary"
                          onClick={() => navigate(`/quiz/${quiz._id}`)}
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                        >
                          Take Quiz
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;