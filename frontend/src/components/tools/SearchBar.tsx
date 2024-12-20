import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/lib/auth.context'
import { Input } from 'src/components/ui/input'
import { Loader2 } from 'lucide-react'
import debounce from 'lodash/debounce'

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Debounce the search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        await onSearch('')
        return
      }
      setIsSearching(true)
      try {
        await onSearch(searchQuery.trim())
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [onSearch]
  )

  useEffect(() => {
    debouncedSearch(query)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query, debouncedSearch])

  return (
    <div className="relative flex w-full max-w-lg">
      <Input
        type="search"
        placeholder={t('tools.search.placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 pr-10"
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  )
}