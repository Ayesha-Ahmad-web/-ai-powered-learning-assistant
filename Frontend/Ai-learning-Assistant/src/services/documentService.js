import API from '../api/services';

const documentService = {
  getAll:   ()         => API.get('/api/documents'),
  getById:  (id)       => API.get(`/api/documents/${id}`),
  delete:   (id)       => API.delete(`/api/documents/${id}`),
  upload:   (formData) => API.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// named exports so both import styles work
export const getDocuments    = ()         => API.get('/api/documents');
export const getDocumentById = (id)       => API.get(`/api/documents/${id}`);
export const deleteDocument  = (id)       => API.delete(`/api/documents/${id}`);
export const uploadDocument  = (formData) => API.post('/api/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export default documentService;