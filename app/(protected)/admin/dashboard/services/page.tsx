"use client"

import { useState } from "react"
import { ServiceFilters } from "@/components/admin/services/service-filters"
import { ServiceTable } from "@/components/admin/services/service-table"
import { BulkActionsToolbar } from "@/components/admin/services/bulk-actions-toolbar"
import type { Service } from "@/types/services"

export default function ServicesPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [services] = useState<Service[]>([
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
      availability: {}
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
      availability: {}
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
      availability: {}
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Products & Services</h1>
        <p className="text-muted-foreground">Manage and monitor all service listings</p>
      </div>

      <ServiceFilters />

      {selectedIds.length > 0 && (
        <BulkActionsToolbar selectedCount={selectedIds.length} onClearSelection={() => setSelectedIds([])} />
      )}

      <ServiceTable services={services} selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} />
    </div>
  )
}

