'use strict';

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question:      { type: String, required: true },
  options:       [{ type: String }],
  correctAnswer: { type: String, required: true },
  explanation:   { type: String, default: '' },
});

const resultSchema = new mongoose.Schema({
  score:   { type: Number },
  total:   { type: Number },
  answers: [{ type: String }],
  takenAt: { type: Date, default: Date.now },
});

const quizSchema = new mongoose.Schema({
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
  title:     { type: String, required: true },
  questions: [questionSchema],
  results:   [resultSchema],
}, { timestamps: true });

// ✅ Prevent model overwrite error
module.exports = mongoose.models.Quiz ||
  mongoose.model('Quiz', quizSchema);