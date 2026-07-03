import API from '../api/services';

// named exports
export const getFlashcards           = ()           => API.get('/api/flashcards');
export const getFlashcardsByDocument = (documentId) => API.get(`/api/flashcards/document/${documentId}`);
export const toggleFavorite          = (fcId, idx)  => API.put(`/api/flashcards/${fcId}/card/${idx}/favorite`);
export const deleteFlashcard         = (id)         => API.delete(`/api/flashcards/${id}`);

// default export
import API from '../api/services';

const flashcardService = {
  getAll:         ()            => API.get('/api/flashcards'),
  getByDocument:  (documentId)  => API.get(`/api/flashcards/document/${documentId}`),
  toggleFavorite: (fcId, idx)   => API.put(`/api/flashcards/${fcId}/card/${idx}/favorite`),
  delete:         (id)          => API.delete(`/api/flashcards/${id}`),
};

export default flashcardService;