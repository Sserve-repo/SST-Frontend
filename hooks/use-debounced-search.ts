"use client"

import { useState, useCallback, useRef } from "react"

interface UseDebounceSearchProps {
    onSearch: (query: string) => void
    delay?: number
}

export function useDebounceSearch({ onSearch, delay = 500 }: UseDebounceSearchProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const fetchSuggestions = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        setIsLoading(true)
        try {
            // This would be replaced with actual API call
            const mockSuggestions = [`${query} suggestion 1`, `${query} suggestion 2`]
            setSuggestions(mockSuggestions)
        } catch (error) {
            console.error("Failed to fetch suggestions:", error)
            setSuggestions([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    const debouncedSetSearchQuery = useCallback(
        (query: string) => {
            setSearchQuery(query)

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(() => {
                onSearch(query)
            }, delay)
        },
        [onSearch, delay],
    )

    return {
        searchQuery,
        setSearchQuery: debouncedSetSearchQuery,
        suggestions,
        isLoading,
        fetchSuggestions,
    }
}
