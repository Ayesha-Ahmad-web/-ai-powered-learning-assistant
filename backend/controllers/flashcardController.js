'use strict';

const mongoose = require('mongoose');

// Direct require — no circular imports
const Flashcard = mongoose.model
  ? (() => { try { return mongoose.model('Flashcard'); } catch(e) { return require('../models/Flashcard'); } })()
  : require('../models/Flashcard');

async function getFlashcards(req, res) {
  try {
    const flashcards = await require('../models/Flashcard')
      .find({ user: req.user._id })
      .populate('document', 'title')
      .sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (error) {
    console.error('getFlashcards error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getFlashcardsByDocument(req, res) {
  try {
    const flashcards = await require('../models/Flashcard').find({
      user:     req.user._id,
      document: req.params.documentId,
    });
    res.json(flashcards);
  } catch (error) {
    console.error('getFlashcardsByDocument error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function toggleFavorite(req, res) {
  try {
    const { flashcardId, cardIndex } = req.params;
    const flashcard = await require('../models/Flashcard').findOne({
      _id:  flashcardId,
      user: req.user._id,
    });
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    const idx = parseInt(cardIndex);
    flashcard.cards[idx].isFavorite = !flashcard.cards[idx].isFavorite;
    await flashcard.save();
    res.json(flashcard);
  } catch (error) {
    console.error('toggleFavorite error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function deleteFlashcard(req, res) {
  try {
    const flashcard = await require('../models/Flashcard').findOne({
      _id:  req.params.id,
      user: req.user._id,
    });
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    await flashcard.deleteOne();
    res.json({ message: 'Flashcard set deleted' });
  } catch (error) {
    console.error('deleteFlashcard error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getFlashcards,
  getFlashcardsByDocument,
  toggleFavorite,
  deleteFlashcard,
};