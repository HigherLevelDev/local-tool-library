import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/lib/auth.context'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      await onSearch(query.trim())
    } finally {
      setIsSearching(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <Input
        type="search"
        placeholder={t('tools.search.placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isSearching || !query.trim()}>
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          t('tools.search.button')
        )}
      </Button>
    </form>
  )
}