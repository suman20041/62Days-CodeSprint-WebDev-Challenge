import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import ApplicationEditorPage from './pages/ApplicationEditorPage'
import BoardPage from './pages/BoardPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

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
                path="/board"
                element={
                  <ProtectedRoute>
                    <BoardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications/new"
                element={
                  <ProtectedRoute>
                    <ApplicationEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications/:id/edit"
                element={
                  <ProtectedRoute>
                    <ApplicationEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-xs text-[var(--color-muted)]">
            HireBoard · Job Application Tracker (Kanban) · Issue #198
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
