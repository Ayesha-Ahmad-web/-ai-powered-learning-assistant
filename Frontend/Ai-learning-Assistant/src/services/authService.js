import API from '../api/services';

const authService = {
  login:          (data) => API.post('/api/auth/login', data),
  register:       (data) => API.post('/api/auth/register', data),
  getProfile:     ()     => API.get('/api/auth/profile'),
  updatePassword: (data) => API.put('/api/auth/password', data),
};

export default authService;