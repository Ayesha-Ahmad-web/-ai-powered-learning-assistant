'use strict';

const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Load controller functions individually
const {
  getFlashcards,
  getFlashcardsByDocument,
  toggleFavorite,
  deleteFlashcard,
} = require('../controllers/flashcardController');

console.log('flashcard functions:', {
  getFlashcards:          typeof getFlashcards,
  getFlashcardsByDocument:typeof getFlashcardsByDocument,
  toggleFavorite:         typeof toggleFavorite,
  deleteFlashcard:        typeof deleteFlashcard,
});

router.get('/',                                      protect, getFlashcards);
router.get('/document/:documentId',                  protect, getFlashcardsByDocument);
router.put('/:flashcardId/card/:cardIndex/favorite', protect, toggleFavorite);
router.delete('/:id',                                protect, deleteFlashcard);

module.exports = router;