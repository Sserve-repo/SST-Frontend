"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"

interface UsePaginationProps {
    totalItems: number
    itemsPerPage?: number
    initialPage?: number
}

export function usePagination({ totalItems, itemsPerPage = 10, initialPage = 1 }: UsePaginationProps) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const currentPage = Number.parseInt(searchParams.get("page") || initialPage.toString(), 10)
    const [pageSize, setPageSize] = useState(itemsPerPage)

    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)

    const setPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page === 1) {
            params.delete("page")
        } else {
            params.set("page", page.toString())
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setPage(currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setPage(currentPage - 1)
        }
    }

    const goToFirstPage = () => setPage(1)
    const goToLastPage = () => setPage(totalPages)

    const paginationInfo = useMemo(
        () => ({
            currentPage,
            totalPages,
            totalItems,
            pageSize,
            startIndex,
            endIndex,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
            isFirstPage: currentPage === 1,
            isLastPage: currentPage === totalPages,
        }),
        [currentPage, totalPages, totalItems, pageSize, startIndex, endIndex],
    )

    return {
        ...paginationInfo,
        setPage,
        setPageSize,
        goToNextPage,
        goToPreviousPage,
        goToFirstPage,
        goToLastPage,
    }
}
