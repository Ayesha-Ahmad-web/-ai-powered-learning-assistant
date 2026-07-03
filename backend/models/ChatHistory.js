'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema({
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
  messages: [messageSchema],
}, { timestamps: true });

// ✅ Prevent model overwrite error
module.exports = mongoose.models.ChatHistory ||
  mongoose.model('ChatHistory', chatHistorySchema);