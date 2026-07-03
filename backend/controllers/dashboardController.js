'use strict';

async function getDashboardOverview(req, res) {
  try {
    const Document  = require('../models/Document');
    const Flashcard = require('../models/Flashcard');
    const Quiz      = require('../models/Quiz');

    const userId = req.user._id;

    const [documents, flashcards, quizzes] = await Promise.all([
      Document.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt filesize'),
      Flashcard.find({ user: userId }).populate('document', 'title'),
      Quiz.find({ user: userId }).populate('document', 'title'),
    ]);

    const totalDocuments  = await Document.countDocuments({ user: userId });
    const totalFlashcards = flashcards.reduce((sum, f) => sum + f.cards.length, 0);

    const recentActivity = [
      ...documents.slice(0, 3).map(d => ({
        type:  'document',
        title: d.title,
        date:  d.createdAt,
      })),
      ...flashcards.slice(0, 3).map(f => ({
        type:  'flashcard',
        title: f.title,
        date:  f.createdAt,
      })),
      ...quizzes.slice(0, 3).map(q => ({
        type:  'quiz',
        title: q.title,
        date:  q.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);

    res.json({
      stats: {
        totalDocuments,
        totalFlashcardSets: flashcards.length,
        totalFlashcards,
        totalQuizzes:       quizzes.length,
      },
      recentActivity,
      recentDocuments: documents,
    });
  } catch (error) {
    console.error('getDashboardOverview error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getDashboardOverview };