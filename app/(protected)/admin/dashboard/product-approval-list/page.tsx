"use client"

import { useState } from "react"
import { BulkActionsToolbar } from "@/components/admin/services/bulk-actions-toolbar"
import { ProductTable } from "@/components/admin/products/product-table"
import { ProductFilters } from "@/components/admin/products/product-filters"
import { IProduct } from "@/types/product"

export default function ProductsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [products] = useState<IProduct[]>([
    {
      id: "1",
      name: "Hair Styling",
      description: "Professional hair styling services",
      category: "Beauty",
      price: 50,
      vendor: {
        id: "v1",
        name: "Beauty Studio",
        email: "contact@beautystudio.com",
      },
      status: "approved",
      featured: true,
      images: ["/placeholder.svg"],
      createdAt: "2024-02-01",
      duration: 0,
    },
    {
      id: "2",
      name: "Deep Tissue Massage",
      description: "60-minute deep tissue massage",
      category: "Wellness",
      price: 80,
      vendor: {
        id: "v2",
        name: "Wellness Center",
        email: "info@wellnesscenter.com",
      },
      status: "pending",
      featured: false,
      images: ["/placeholder.svg"],
      createdAt: "2024-02-15",
      duration: 0,
    },
    {
      id: "3",
      name: "Nail Art",
      description: "Creative nail art and manicure",
      category: "Beauty",
      price: 35,
      vendor: {
        id: "v3",
        name: "Nail Paradise",
        email: "hello@nailparadise.com",
      },
      status: "rejected",
      featured: false,
      images: ["/placeholder.svg"],
      createdAt: "2024-02-10",
      duration: 0,
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Products</h1>
        <p className="text-muted-foreground">Manage and monitor all product listings</p>
      </div>

      <ProductFilters />

      {selectedIds.length > 0 && (
        <BulkActionsToolbar selectedCount={selectedIds.length} onClearSelection={() => setSelectedIds([])} />
      )}

      <ProductTable products={products} selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} />
    </div>
  )
}

