import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Tool } from '../../lib/tool.service'
import { ToolCard } from './ToolCard'
import { getThemeClass } from '../../lib/theme'
import { useAuth } from '../../lib/auth.context'

interface SearchResultsProps {
  results: Tool[]
  total: number
  loading?: boolean
}

export function SearchResults({ results, total, loading }: SearchResultsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: window.location.pathname } })
    }
  }, [isAuthenticated, navigate])

  const handleToolClick = (tool: Tool) => {
    if (isAuthenticated) {
      navigate(`/tools/${tool.id}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className={getThemeClass('components.text.body')}>{t('common.loading')}</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className={getThemeClass('components.text.body')}>{t('tools.search.noResults')}</p>
      </div>
    )
  }

  return (
    <div>
      <p className={`mb-4 ${getThemeClass('components.text.body')}`}>
        {t('tools.search.resultsCount', { count: total })}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((tool) => (
          <div key={tool.id} onClick={() => handleToolClick(tool)} className="cursor-pointer">
            <ToolCard
              tool={tool}
              onEdit={() => {}}
              onDelete={async () => {}}
              isSearchResult
            />
          </div>
        ))}
      </div>
    </div>
  )
}