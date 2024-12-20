import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/lib/auth.context'
import { Hero } from 'src/components/hero'
import { SearchBar } from 'src/components/tools/SearchBar'
import { SearchResultCard } from 'src/components/tools/SearchResultCard'
import { useToolSearch } from 'src/hooks/use-tool-search'

export default function Home() {
  const { t } = useTranslation('translation')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { searchResults, isSearching, hasSearched, handleSearch } = useToolSearch()

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
