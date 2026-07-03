'use strict';

async function getQuizzes(req, res) {
  try {
    const Quiz = require('../models/Quiz');
    const quizzes = await Quiz
      .find({ user: req.user._id })
      .populate('document', 'title')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error('getQuizzes error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getQuizById(req, res) {
  try {
    const Quiz = require('../models/Quiz');
    const quiz = await Quiz
      .findOne({ _id: req.params.id, user: req.user._id })
      .populate('document', 'title');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    console.error('getQuizById error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function submitQuiz(req, res) {
  try {
    const Quiz = require('../models/Quiz');
    const { answers } = req.body;
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    quiz.results.push({ score, total: quiz.questions.length, answers });
    await quiz.save();

    res.json({
      score,
      total:     quiz.questions.length,
      answers,
      questions: quiz.questions,
    });
  } catch (error) {
    console.error('submitQuiz error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getQuizResults(req, res) {
  try {
    const Quiz = require('../models/Quiz');
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ results: quiz.results, questions: quiz.questions });
  } catch (error) {
    console.error('getQuizResults error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function deleteQuiz(req, res) {
  try {
    const Quiz = require('../models/Quiz');
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    console.error('deleteQuiz error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz,
};