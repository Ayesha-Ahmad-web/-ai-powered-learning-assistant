import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;

// Named exports (for pages that use them directly)
export const register    = (data)       => API.post('/api/auth/register', data);
export const login       = (data)       => API.post('/api/auth/login', data);
export const getProfile  = ()           => API.get('/api/auth/profile');
export const updatePassword = (data)    => API.put('/api/auth/password', data);

export const getDocuments    = ()       => API.get('/api/documents');
export const getDocumentById = (id)     => API.get(`/api/documents/${id}`);
export const uploadDocument  = (form)   => API.post('/api/documents/upload', form, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteDocument  = (id)     => API.delete(`/api/documents/${id}`);

export const getFlashcards          = ()            => API.get('/api/flashcards');
export const getFlashcardsByDocument= (docId)       => API.get(`/api/flashcards/document/${docId}`);
export const toggleFavorite         = (fcId, idx)   => API.put(`/api/flashcards/${fcId}/card/${idx}/favorite`);
export const deleteFlashcard        = (id)          => API.delete(`/api/flashcards/${id}`);

export const getQuizzes    = ()         => API.get('/api/quizzes');
export const getQuizById   = (id)       => API.get(`/api/quizzes/${id}`);
export const submitQuiz    = (id, ans)  => API.post(`/api/quizzes/${id}/submit`, { answers: ans });
export const getQuizResults= (id)       => API.get(`/api/quizzes/${id}/results`);
export const deleteQuiz    = (id)       => API.delete(`/api/quizzes/${id}`);

export const generateSummary    = (documentId)         => API.post('/api/ai/summary',     { documentId });
export const sendChatMessage    = (documentId, message)=> API.post('/api/ai/chat',        { documentId, message });
export const getChatHistory     = (documentId)         => API.get(`/api/ai/chat/${documentId}`);
export const explainConcept     = (documentId, concept)=> API.post('/api/ai/explain',     { documentId, concept });
export const generateFlashcards = (documentId, count)  => API.post('/api/ai/flashcards',  { documentId, count });
export const generateQuiz       = (documentId, count)  => API.post('/api/ai/quiz',        { documentId, count });

export const getDashboardOverview = () => API.get('/api/dashboard/overview');

// Default export (the axios instance itself)
export default API;