'use strict';

const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const path       = require('path');
const fs         = require('fs');
const { protect }= require('../middleware/authMiddleware');

const documentController = require('../controllers/documentController');

// Auto create uploads folder
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

console.log('documentController:', documentController);

router.get('/',        protect, documentController.getDocuments);
router.post('/upload', protect, upload.single('file'), documentController.uploadDocument);
router.get('/:id',     protect, documentController.getDocumentById);
router.delete('/:id',  protect, documentController.deleteDocument);

module.exports = router;