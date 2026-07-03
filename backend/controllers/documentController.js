'use strict';

const path = require('path');
const fs   = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ uploads folder created');
}

const extractTextFromPDF = async (filepath) => {
  try {
    const pdfParse   = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filepath);
    const data       = await pdfParse(dataBuffer);
    const text       = data.text || '';
    console.log('✅ PDF text extracted, length:', text.length);
    console.log('✅ First 200 chars:', text.substring(0, 200));
    return text;
  } catch (err) {
    console.log('⚠️ PDF parsing error:', err.message);
    return '';
  }
};

async function uploadDocument(req, res) {
  try {
    const Document = require('../models/Document');

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title }     = req.body;
    const filepath      = req.file.path;
    const filesize      = req.file.size;
    const extractedText = await extractTextFromPDF(filepath);

    const document = await Document.create({
      user:  req.user._id,
      title: title || req.file.originalname,
      filename:  req.file.filename,
      filepath,
      filesize,
      extractedText,
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('uploadDocument error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getDocuments(req, res) {
  try {
    const Document  = require('../models/Document');
    const documents = await Document
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('getDocuments error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getDocumentById(req, res) {
  try {
    const Document = require('../models/Document');
    const document = await Document.findOne({
      _id:  req.params.id,
      user: req.user._id,
    });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('getDocumentById error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function deleteDocument(req, res) {
  try {
    const Document = require('../models/Document');
    const document = await Document.findOne({
      _id:  req.params.id,
      user: req.user._id,
    });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (fs.existsSync(document.filepath)) {
      fs.unlinkSync(document.filepath);
    }
    await document.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('deleteDocument error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};