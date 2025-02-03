export type TransactionType = {
    id: string
    productName: string
    date: string
    status: "pending" | "completed" | "cancelled" | "in-transit"
    amount: string
}

export type OverviewType = {
    Transactions: TransactionType[]
    TotalExpenditure: string
    orderInProgress: string
    cancelledOrder: string
    pendingOrder: string
    completeOrder: string
    // Service specific
    serviceInProgress?: string
    cancelledService?: string
    pendingService?: string
    completedService?: string
}

export type UserRole = "2" | "3" | "4" // 2: Shopper, 3: Vendor, 4: Artisan

