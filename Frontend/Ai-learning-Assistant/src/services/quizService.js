import API from '../api/services';

const quizService = {
  getAll:     ()           => API.get('/api/quizzes'),
  getById:    (id)         => API.get(`/api/quizzes/${id}`),
  submit:     (id, answers)=> API.post(`/api/quizzes/${id}/submit`, { answers }),
  getResults: (id)         => API.get(`/api/quizzes/${id}/results`),
  delete:     (id)         => API.delete(`/api/quizzes/${id}`),
};

export default quizService;