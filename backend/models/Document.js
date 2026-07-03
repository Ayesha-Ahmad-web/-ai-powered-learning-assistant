'use strict';

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  title:         { type: String, required: true },
  filename:      { type: String, required: true },
  filepath:      { type: String, required: true },
  filesize:      { type: Number, required: true },
  extractedText: { type: String, default: '' },
  summary:       { type: String, default: '' },
}, { timestamps: true });

// ✅ Prevent model overwrite error
module.exports = mongoose.models.Document ||
  mongoose.model('Document', documentSchema);