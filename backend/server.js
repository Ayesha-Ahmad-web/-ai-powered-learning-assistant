'use strict';

const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const connectDB = require('./config/db');

dotenv.config();
console.log('GEMINI KEY loaded:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'MISSING');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'AI Learning Assistant API running on port 8000' });
});

try {
  const authRoutes      = require('./routes/authRoutes');
  const documentRoutes  = require('./routes/documentRoutes');
  const flashcardRoutes = require('./routes/flashcardRoutes');
  const quizRoutes      = require('./routes/quizRoutes');
  const aiRoutes        = require('./routes/aiRoutes');
  const dashboardRoutes = require('./routes/dashboardRoutes');

  app.use('/api/auth',       authRoutes);
  app.use('/api/documents',  documentRoutes);
  app.use('/api/flashcards', flashcardRoutes);
  app.use('/api/quizzes',    quizRoutes);
  app.use('/api/ai',         aiRoutes);
  app.use('/api/dashboard',  dashboardRoutes);

  console.log('✅ All routes loaded successfully');
} catch (err) {
  console.error('❌ Route loading error:', err.message);
}

app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});