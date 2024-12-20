import { useState, useCallback, useRef } from 'react'
import { Tool, ToolService } from '../lib/tool.service'

export function useToolSearch() {
  const [searchResults, setSearchResults] = useState<Tool[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const lastQuery = useRef<string>('')

  const handleSearch = useCallback(async (query: string) => {
    // Don't search if the query is the same as the last one
    if (query === lastQuery.current) {
      return
    }

    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      lastQuery.current = ''
      return
    }
    
    setIsSearching(true)
    try {
      lastQuery.current = query
      const response = await ToolService.searchTools(query)
      setSearchResults(response?.tools || [])
      setHasSearched(true)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  return {
    searchResults,
    isSearching,
    hasSearched,
    handleSearch
  }
}