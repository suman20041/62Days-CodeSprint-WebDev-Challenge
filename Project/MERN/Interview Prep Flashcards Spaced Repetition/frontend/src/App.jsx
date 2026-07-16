import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import AiGeneratePage from './pages/AiGeneratePage'
import CardEditorPage from './pages/CardEditorPage'
import CardsPage from './pages/CardsPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ReviewPage from './pages/ReviewPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cards"
                element={
                  <ProtectedRoute>
                    <CardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cards/new"
                element={
                  <ProtectedRoute>
                    <CardEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cards/ai"
                element={
                  <ProtectedRoute>
                    <AiGeneratePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cards/:id/edit"
                element={
                  <ProtectedRoute>
                    <CardEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review"
                element={
                  <ProtectedRoute>
                    <ReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-[var(--color-muted)]">
            CardForge · Interview Prep Flashcards (Spaced Repetition) · Issue #197
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
