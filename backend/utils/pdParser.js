const fs = require('fs');
const pdfParse = require('pdf-parse');

const extractTextFromPDF = async (filepath) => {
  try {
    const dataBuffer = fs.readFileSync(filepath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text || '';
  } catch (error) {
    console.log('PDF parsing warning (non-fatal):', error.message);
    return '';
  }
};

module.exports = extractTextFromPDF;