import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from './auth.service'

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, phone: string, postcode: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize auth state
    const initAuth = () => {
      try {
        const isAuth = AuthService.isAuthenticated()
        const userData = AuthService.getUser()
        
        // Only set authenticated if we have both a token and valid user data
        if (isAuth && userData) {
          setIsAuthenticated(true)
          setUser(userData)
        } else {
          // If we don't have both, clear the auth state
          AuthService.logout()
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (err) {
        console.error('Failed to initialize auth state:', err)
        setError('Failed to initialize authentication')
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await AuthService.login({ email, password })
      setIsAuthenticated(true)
      setUser(response.user_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, phone: string, postcode: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await AuthService.signup({ name, email, password, phone, postcode })
      setIsAuthenticated(true)
      setUser(response.user_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const logout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading,
      error,
      login, 
      signup, 
      logout,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}