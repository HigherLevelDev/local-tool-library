import React from 'react'
import { createHashRouter, RouteObject, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth.context'
import ErrorPage from './components/error-page'
import { getDefaultLayout } from './components/layout'
import HomePage from './pages/home'
import { LoginPage } from './pages/auth/login'
import { SignupPage } from './pages/auth/signup'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

export const routerObjects: RouteObject[] = [
  {
    path: '/',
    element: getDefaultLayout(<ProtectedRoute><HomePage /></ProtectedRoute>),
  },
  {
    path: '/login',
    element: getDefaultLayout(<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>),
  },
  {
    path: '/auth/login',
    element: getDefaultLayout(<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>),
  },
  {
    path: '/signup',
    element: getDefaultLayout(<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>),
  },
  {
    path: '/auth/signup',
    element: getDefaultLayout(<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>),
  },
]

export function createRouter(): ReturnType<typeof createHashRouter> {
  const routeWrappers = routerObjects.map((router) => {
    return {
      ...router,
      ErrorBoundary: ErrorPage,
    }
  })
  return createHashRouter(routeWrappers)
}
