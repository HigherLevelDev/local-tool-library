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
  const [hasSearched, setHasSearched] = useState(false)
  const { t } = useTranslation('translation')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }
    
    setIsSearching(true)
    try {
      const response = await ToolService.searchTools(query)
      setSearchResults(response?.tools || [])
      setHasSearched(true)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
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
          
          <div className="w-full">
            {hasSearched && !isSearching && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('tools.search.noResults')}</p>
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((tool) => (
                  <SearchResultCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
