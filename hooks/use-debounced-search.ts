"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface UseDebounceSearchProps {
    onSearch: (query: string) => void
    delay?: number
}

export function useDebounceSearch({ onSearch, delay = 500 }: UseDebounceSearchProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout>()
    const debouncedSearchQuery = useDebounce(searchQuery, delay)

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

    useEffect(() => {
        onSearch(debouncedSearchQuery)
    }, [debouncedSearchQuery, onSearch])

    return {
        searchQuery,
        setSearchQuery,
        suggestions,
        isLoading,
        fetchSuggestions,
    }
}

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}
