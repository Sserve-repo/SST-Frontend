import { useState, useEffect } from 'react'
import { baseUrl } from '@/config/constant'
import { SearchResults } from '@/types/search'

export function useSearch(initialQuery: string = '') {
    const [query, setQuery] = useState(initialQuery)
    const [results, setResults] = useState<SearchResults | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchResults = async () => {
            if (query.trim() === '') {
                setResults(null)
                setError(null)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    `${baseUrl}/general/search/globalSearch?query=${encodeURIComponent(query)}`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error('Search failed')
                }

                const data = await response.json()

                // Transform response into the expected format
                const groupedResults = {
                    suggestions: [],
                    products: [],
                    services: [],
                }

                data.data['Query Details'].forEach((item: any) => {
                    if (item.type === 'service') {
                        groupedResults.services.push(item)
                    } else if (item.type === 'product') {
                        groupedResults.products.push(item)
                    } else {
                        groupedResults.suggestions.push(item)
                    }
                })

                setResults(groupedResults)
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return
                }
                setError('Failed to fetch search results')
                setResults(null)
            } finally {
                setIsLoading(false)
            }
        }


        const debounceTimer = setTimeout(fetchResults, 300)

        return () => {
            controller.abort()
            clearTimeout(debounceTimer)
        }
    }, [query])

    return {
        query,
        setQuery,
        results,
        isLoading,
        error
    }
}

