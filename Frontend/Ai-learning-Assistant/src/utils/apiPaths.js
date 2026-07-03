const BASE_URL = 'http://localhost:8000';

export const API_PATHS = {
  AUTH: {
    LOGIN:           '/api/auth/login',
    REGISTER:        '/api/auth/register',
    PROFILE:         '/api/auth/profile',
    UPDATE_PASSWORD: '/api/auth/password',
  },
  DOCUMENTS: {
    GET_ALL:  '/api/documents',
    UPLOAD:   '/api/documents/upload',
    GET_BY_ID:(id) => `/api/documents/${id}`,
    DELETE:   (id) => `/api/documents/${id}`,
  },
  AI: {
    SUMMARY:      '/api/ai/summary',
    CHAT:         '/api/ai/chat',
    CHAT_HISTORY: (docId) => `/api/ai/chat/${docId}`,
    EXPLAIN:      '/api/ai/explain',
    FLASHCARDS:   '/api/ai/flashcards',
    QUIZ:         '/api/ai/quiz',
  },
  FLASHCARDS: {
    GET_ALL:        '/api/flashcards',
    GET_BY_DOCUMENT:(docId)       => `/api/flashcards/document/${docId}`,
    TOGGLE_FAVORITE:(fcId, idx)   => `/api/flashcards/${fcId}/card/${idx}/favorite`,
    DELETE:         (id)          => `/api/flashcards/${id}`,
  },
  QUIZZES: {
    GET_ALL:  '/api/quizzes',
    GET_BY_ID:(id) => `/api/quizzes/${id}`,
    SUBMIT:   (id) => `/api/quizzes/${id}/submit`,
    RESULTS:  (id) => `/api/quizzes/${id}/results`,
    DELETE:   (id) => `/api/quizzes/${id}`,
  },
  DASHBOARD: {
    OVERVIEW: '/api/dashboard/overview',
  },
};

export default BASE_URL;