import API from '../api/services';

const aiService = {
  generateSummary:    (documentId)          => API.post('/api/ai/summary',    { documentId }),
  chat:               (documentId, message) => API.post('/api/ai/chat',       { documentId, message }),
  getChatHistory:     (documentId)          => API.get(`/api/ai/chat/${documentId}`),
  explainConcept:     (documentId, concept) => API.post('/api/ai/explain',    { documentId, concept }),
  generateFlashcards: (documentId, count)   => API.post('/api/ai/flashcards', { documentId, count }),
  generateQuiz:       (documentId, count)   => API.post('/api/ai/quiz',       { documentId, count }),
};

export default aiService;