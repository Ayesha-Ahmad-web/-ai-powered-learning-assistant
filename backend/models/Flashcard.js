'use strict';

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  question:   { type: String, required: true },
  answer:     { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
});

const flashcardSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  document: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Document',
    required: true,
  },
  title: { type: String, required: true },
  cards: [cardSchema],
}, { timestamps: true });

// ✅ Prevent model overwrite error
module.exports = mongoose.models.Flashcard ||
  mongoose.model('Flashcard', flashcardSchema);