import API from '../api/services';

const dashboardService = {
  getOverview: () => API.get('/api/dashboard/overview'),
};

export default dashboardService;