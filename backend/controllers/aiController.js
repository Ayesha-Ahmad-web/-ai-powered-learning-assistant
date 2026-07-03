'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODELS = [
  'gemini-3.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-pro',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro-latest',
  'gemini-pro',
];

let workingModel = 'gemini-2 .0-flash';

const findWorkingModel = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  for (const model of MODELS) {
    try {
      const m      = genAI.getGenerativeModel({ model });
      const result = await m.generateContent('Say hello in one word');
      const text   = result.response.text();
      if (text) {
        workingModel = model;
        console.log(`✅ Working Gemini model: ${model}`);
        return;
      }
    } catch (err) {
      console.log(`❌ Model ${model} failed: ${err.message.substring(0, 80)}`);
    }
  }
  console.log('⚠️ No working model found — check your API key');
};

findWorkingModel();

const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: workingModel });
};

const truncateText = (text, maxChars = 15000) => {
  if (!text) return 'No content available';
  return text.slice(0, maxChars);
};

const cleanJSON = (text) => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json/gi, '');
  cleaned = cleaned.replace(/```/g, '');
  cleaned = cleaned.trim();
  const start = cleaned.indexOf('[');
  const end   = cleaned.lastIndexOf(']');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }
  return cleaned;
};

async function generateFlashcards(req, res) {
  try {
    const Document  = require('../models/Document');
    const Flashcard = require('../models/Flashcard');
    const { documentId, count = 10 } = req.body;
    if (!documentId) return res.status(400).json({ message: 'documentId is required' });
    const document = await Document.findOne({ _id: documentId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });
    const docContent = (document.extractedText && document.extractedText.trim())
      ? document.extractedText : `Document Title: ${document.title}`;
    const model  = getModel();
    const prompt = `Generate exactly ${count} flashcards from the content below.
Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
Each item must have "question" and "answer" string fields.
Example: [{"question":"What is X?","answer":"X is Y."}]
Content: ${truncateText(docContent)}`;
    const result = await model.generateContent(prompt);
    const text   = result.response.text();
    let cards;
    try {
      cards = JSON.parse(cleanJSON(text));
      if (!Array.isArray(cards)) throw new Error('Not an array');
    } catch (e) {
      return res.status(500).json({ message: 'AI returned invalid format. Try again.' });
    }
    const flashcard = await Flashcard.create({
      user: req.user._id, document: documentId,
      title: `Flashcards: ${document.title}`,
      cards: cards.map(c => ({
        question: String(c.question || ''),
        answer: String(c.answer || ''),
        isFavorite: false,
      })),
    });
    res.status(201).json(flashcard);
  } catch (error) {
    console.error('generateFlashcards error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function generateQuiz(req, res) {
  try {
    const Document = require('../models/Document');
    const Quiz     = require('../models/Quiz');
    const { documentId, count = 5 } = req.body;
    if (!documentId) return res.status(400).json({ message: 'documentId is required' });
    const document = await Document.findOne({ _id: documentId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });
    const docContent = (document.extractedText && document.extractedText.trim())
      ? document.extractedText : `Document Title: ${document.title}`;
    const model  = getModel();
    const prompt = `Generate exactly ${count} multiple choice questions from the content below.
Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
Each item must have: "question" (string), "options" (array of exactly 4 strings), "correctAnswer" (one of the 4 options), "explanation" (string).
Example: [{"question":"What is X?","options":["A","B","C","D"],"correctAnswer":"A","explanation":"Because..."}]
Content: ${truncateText(docContent)}`;
    const result = await model.generateContent(prompt);
    const text   = result.response.text();
    let questions;
    try {
      questions = JSON.parse(cleanJSON(text));
      if (!Array.isArray(questions)) throw new Error('Not an array');
    } catch (e) {
      return res.status(500).json({ message: 'AI returned invalid format. Try again.' });
    }
    const quiz = await Quiz.create({
      user: req.user._id, document: documentId,
      title: `Quiz: ${document.title}`,
      questions: questions.map(q => ({
        question: String(q.question || ''),
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: String(q.correctAnswer || ''),
        explanation: String(q.explanation || ''),
      })),
    });
    res.status(201).json(quiz);
  } catch (error) {
    console.error('generateQuiz error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function generateSummary(req, res) {
  try {
    const Document = require('../models/Document');
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ message: 'documentId is required' });
    const document = await Document.findOne({ _id: documentId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });
    const docContent = (document.extractedText && document.extractedText.trim())
      ? document.extractedText : `Document Title: ${document.title}`;
    const model  = getModel();
    const prompt = `Provide a comprehensive summary of the following content.
Include key concepts, main points, and important takeaways. Write in clear paragraphs.
Content: ${truncateText(docContent)}`;
    const result  = await model.generateContent(prompt);
    const summary = result.response.text().trim();
    document.summary = summary;
    await document.save();
    res.json({ summary });
  } catch (error) {
    console.error('generateSummary error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function chat(req, res) {
  try {
    const Document    = require('../models/Document');
    const ChatHistory = require('../models/ChatHistory');
    const { documentId, message } = req.body;
    if (!documentId || !message) {
      return res.status(400).json({ message: 'documentId and message are required' });
    }
    const document = await Document.findOne({ _id: documentId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });
    let chatHistory = await ChatHistory.findOne({ user: req.user._id, document: documentId });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        user: req.user._id, document: documentId, messages: [],
      });
    }
    const docContent = (document.extractedText && document.extractedText.trim())
      ? document.extractedText : `Document Title: ${document.title}`;
    const prevMessages = chatHistory.messages.slice(-6)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
    const model  = getModel();
    const prompt = `You are a helpful AI learning assistant.
Answer questions based on the document content below.
If the answer is not in the document say "I could not find that in the document."
Document Title: ${document.title}
Document Content: ${truncateText(docContent, 10000)}
${prevMessages ? `Previous conversation:\n${prevMessages}\n` : ''}
User: ${message}
Assistant:`;
    const result = await model.generateContent(prompt);
    const reply  = result.response.text().trim();
    chatHistory.messages.push({ role: 'user', content: message });
    chatHistory.messages.push({ role: 'assistant', content: reply });
    await chatHistory.save();
    res.json({ reply, chatHistory: chatHistory.messages });
  } catch (error) {
    console.error('chat error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function explainConcept(req, res) {
  try {
    const Document = require('../models/Document');
    const { documentId, concept } = req.body;
    if (!documentId || !concept) {
      return res.status(400).json({ message: 'documentId and concept are required' });
    }
    const document = await Document.findOne({ _id: documentId, user: req.user._id });
    if (!document) return res.status(404).json({ message: 'Document not found' });
    const docContent = (document.extractedText && document.extractedText.trim())
      ? document.extractedText : `Document Title: ${document.title}`;
    const model  = getModel();
    const prompt = `Based on the content below, explain the concept: "${concept}"
Include definition, examples, and how it relates to other concepts.
Write in a clear and educational way.
Content: ${truncateText(docContent)}`;
    const result      = await model.generateContent(prompt);
    const explanation = result.response.text().trim();
    res.json({ explanation });
  } catch (error) {
    console.error('explainConcept error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getChatHistory(req, res) {
  try {
    const ChatHistory = require('../models/ChatHistory');
    const { documentId } = req.params;
    const chatHistory = await ChatHistory.findOne({
      user: req.user._id, document: documentId,
    });
    res.json(chatHistory ? chatHistory.messages : []);
  } catch (error) {
    console.error('getChatHistory error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  findWorkingModel,
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
};

// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const generateText = async (prompt) => {
//   const completion = await openai.chat.completions.create({
//     model:    'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: prompt }],
//   });
//   return completion.choices[0].message.content;
// };