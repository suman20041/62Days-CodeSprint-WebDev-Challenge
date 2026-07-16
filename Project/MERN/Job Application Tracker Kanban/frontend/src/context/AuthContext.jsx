import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)
const TOKEN_KEY = 'hireboard-token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
