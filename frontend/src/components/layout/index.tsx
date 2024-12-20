import React from 'react'
import { Header } from '../header'

export const getNoneLayout = (page: React.ReactElement) => page

export const getDefaultLayout = (page: React.ReactElement) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {page}
      </main>
    </div>
  )
}
