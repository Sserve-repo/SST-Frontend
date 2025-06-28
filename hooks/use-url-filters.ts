"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

interface FilterState {
    category: string
    status: string
    search: string
    page: string
    limit: string
}

export function useUrlFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const filters = useMemo(
        (): FilterState => ({
            category: searchParams.get("category") || "",
            status: searchParams.get("status") || "",
            search: searchParams.get("search") || "",
            page: searchParams.get("page") || "1",
            limit: searchParams.get("limit") || "10",
        }),
        [searchParams],
    )

    const updateFilters = useCallback(
        (newFilters: Partial<FilterState>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(newFilters).forEach(([key, value]) => {
                if (value && value !== "all" && value !== "") {
                    params.set(key, value)
                } else {
                    params.delete(key)
                }
            })

            // Reset page when filters change (except when only page changes)
            if (Object.keys(newFilters).some((key) => key !== "page" && key !== "limit")) {
                params.set("page", "1")
            }

            const newUrl = `${window.location.pathname}?${params.toString()}`
            router.push(newUrl, { scroll: false })
        },
        [router, searchParams],
    )

    const clearFilters = useCallback(() => {
        const params = new URLSearchParams()
        params.set("page", "1")
        params.set("limit", filters.limit)

        const newUrl = `${window.location.pathname}?${params.toString()}`
        router.push(newUrl, { scroll: false })
    }, [router, filters.limit])

    return {
        filters,
        updateFilters,
        clearFilters,
    }
}
