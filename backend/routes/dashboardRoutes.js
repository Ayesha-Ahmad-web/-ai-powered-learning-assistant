'use strict';

const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  getDashboardOverview,
} = require('../controllers/dashboardController');

console.log('dashboard functions:', {
  getDashboardOverview: typeof getDashboardOverview,
});

router.get('/overview', protect, getDashboardOverview);

module.exports = router;