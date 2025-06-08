"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"

interface UseDebounceSearchProps {
    delay?: number
    onSearch?: (query: string) => void
}

export function useDebounceSearch({ delay = 500, onSearch }: UseDebounceSearchProps = {}) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, delay)

        return () => clearTimeout(timer)
    }, [searchQuery, delay])

    // Update URL when debounced query changes
    useEffect(() => {
        if (debouncedQuery !== searchParams.get("search")) {
            const params = new URLSearchParams(searchParams.toString())
            if (debouncedQuery) {
                params.set("search", debouncedQuery)
            } else {
                params.delete("search")
            }
            router.push(`?${params.toString()}`, { scroll: false })
        }
    }, [debouncedQuery, searchParams, router])

    // Call onSearch when debounced query changes
    useEffect(() => {
        if (onSearch && debouncedQuery) {
            onSearch(debouncedQuery)
        }
    }, [debouncedQuery, onSearch])

    const fetchSuggestions = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        setIsLoading(true)
        try {
            // This would be replaced with actual API call
            const mockSuggestions = [
                `${query} products`,
                `${query} services`,
                `${query} vendors`,
                `${query} categories`,
            ].filter((s) => s.toLowerCase().includes(query.toLowerCase()))

            setSuggestions(mockSuggestions)
        } catch (error) {
            console.error("Failed to fetch suggestions:", error)
            setSuggestions([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        searchQuery,
        setSearchQuery,
        debouncedQuery,
        suggestions,
        isLoading,
        fetchSuggestions,
    }
}
