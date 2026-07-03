'use strict';

const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
} = require('../controllers/aiController');

console.log('ai functions:', {
  generateFlashcards: typeof generateFlashcards,
  generateQuiz:       typeof generateQuiz,
  generateSummary:    typeof generateSummary,
  chat:               typeof chat,
  explainConcept:     typeof explainConcept,
  getChatHistory:     typeof getChatHistory,
});

router.post('/flashcards',      protect, generateFlashcards);
router.post('/quiz',            protect, generateQuiz);
router.post('/summary',         protect, generateSummary);
router.post('/chat',            protect, chat);
router.post('/explain',         protect, explainConcept);
router.get('/chat/:documentId', protect, getChatHistory);

module.exports = router;