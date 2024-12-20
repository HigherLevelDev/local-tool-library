import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/lib/auth.context'
import { Hero } from 'src/components/hero'
import { SearchBar } from 'src/components/tools/SearchBar'
import { ToolService, Tool } from 'src/lib/tool.service'
import { SearchResultCard } from 'src/components/tools/SearchResultCard'

export default function Home() {
  const [searchResults, setSearchResults] = useState<Tool[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { t } = useTranslation('translation')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Only show login prompt when trying to access protected features
  useEffect(() => {
    // Initial load of featured or recent tools could go here
  }, [])
  const handleSearch = async (query: string) => {
    setIsSearching(true)
    try {
      const response = await ToolService.searchTools(query)
      setSearchResults(response.items)
    } catch (error) {
      console.error('Search failed:', error)
      // TODO: Add error toast
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <SearchBar onSearch={handleSearch} />
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((tool) => (
                <SearchResultCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
