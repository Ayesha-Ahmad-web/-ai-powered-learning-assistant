import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';

import LoginPage          from './pages/Auth/LoginPage';
import RegisterPage       from './pages/Auth/RegisterPage';
import DashboardPage      from './pages/Dashboard/DashboardPage';
import DocumentsListPage  from './pages/Documents/DocumentsListPage';
import DocumentDetailPage from './pages/Documents/DocumentsDetailPage';
import FlashcardPage      from './pages/Flashcards/FlashcardPage';
import QuizTakePage       from './pages/Quizzes/QuizTakePage';
import QuizResultPage     from './pages/Quizzes/QuizResultPage';
import ProfilePage        from './pages/Profile/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#16161f',
              color: '#f0f0f8',
              border: '1px solid rgba(108,99,255,0.2)',
            },
          }}
        />
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Navbar />
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/documents" element={
            <ProtectedRoute>
              <Navbar />
              <DocumentsListPage />
            </ProtectedRoute>
          } />

          <Route path="/documents/:id" element={
            <ProtectedRoute>
              <Navbar />
              <DocumentDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/flashcards" element={
            <ProtectedRoute>
              <Navbar />
              <FlashcardPage />
            </ProtectedRoute>
          } />

          <Route path="/quiz/:id" element={
            <ProtectedRoute>
              <Navbar />
              <QuizTakePage />
            </ProtectedRoute>
          } />

          <Route path="/quiz/:id/result" element={
            <ProtectedRoute>
              <Navbar />
              <QuizResultPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Navbar />
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;