"use client"

import { useState, useEffect } from "react"
import { BulkActionsToolbar } from "@/components/admin/products/bulk-actions-toolbar"
import { ProductTable } from "@/components/admin/products/product-table"
import { ProductFilters } from "@/components/admin/products/product-filters"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import type { IProduct } from "@/types/product"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle, Package } from "lucide-react"
import { getProducts, updateProductStatus, deleteProducts, type Product } from "@/actions/admin/product-api"

interface ProductStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function ProductApprovalPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: apiError } = await getProducts({
        product_category: filters.category || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      })

      if (apiError) {
        throw new Error(apiError)
      }

      if (data?.productListing) {
        const formattedProducts: IProduct[] = data.productListing.map((product: Product) => ({
          id: product.id.toString(),
          name: product.title,
          description: product.description,
          category: product.category?.name || "Uncategorized",
          price: Number.parseFloat(product.price),
          vendor: {
            id: product.id.toString(),
            name: "Vendor Name", // This would come from a join or separate call
            email: "vendor@email.com", // This would come from a join or separate call
          },
          status: getStatusFromNumber(product.status),
          featured: false, // This would come from the API if available
          images: product.image ? [product.image] : ["/placeholder.svg"],
          createdAt: product.created_at,
          duration: 0,
        }))

        setProducts(formattedProducts)
        calculateStats(formattedProducts)
      } else {
        throw new Error("No product data received")
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      // setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const getStatusFromNumber = (status: number): "pending" | "approved" | "rejected" => {
    switch (status) {
      case 1:
        return "approved"
      case 2:
        return "rejected"
      default:
        return "pending"
    }
  }

  const calculateStats = (productList: IProduct[]) => {
    const newStats = {
      total: productList.length,
      pending: productList.filter((p) => p.status === "pending").length,
      approved: productList.filter((p) => p.status === "approved").length,
      rejected: productList.filter((p) => p.status === "rejected").length,
    }
    setStats(newStats)
  }

  const handleBulkAction = async (action: "approve" | "reject" | "delete" | "feature") => {
    if (selectedIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select products to perform this action.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      const productIds = selectedIds.map((id) => Number.parseInt(id))
      let result

      switch (action) {
        case "approve":
        case "reject":
          result = await updateProductStatus({
            status: action === "approve" ? "approved" : "rejected",
            product_ids: productIds,
          })
          break
        case "delete":
          result = await deleteProducts(productIds)
          break
        case "feature":
          toast({
            title: "Feature",
            description: "Feature functionality coming soon.",
          })
          return
      }

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Success",
        description: `${selectedIds.length} product(s) ${action}d successfully.`,
      })

      setSelectedIds([])
      await fetchProducts()
    } catch (err) {
      console.error(`Failed to ${action} products:`, err)
      toast({
        title: "Error",
        description: `Failed to ${action} products. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesStatus = !filters.status || product.status === filters.status
    const matchesSearch =
      !filters.search ||
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.vendor.name.toLowerCase().includes(filters.search.toLowerCase())

    return matchesCategory && matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProducts} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Product Approval</h1>
        <p className="text-muted-foreground">Review and manage product listings awaiting approval</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All product listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Live products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Declined products</p>
          </CardContent>
        </Card>
      </div>

      <ProductFilters onFiltersChange={setFilters} />

      {selectedIds.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onApprove={() => handleBulkAction("approve")}
          onReject={() => handleBulkAction("reject")}
          onDelete={() => handleBulkAction("delete")}
          onFeature={() => handleBulkAction("feature")}
          isLoading={isUpdating}
        />
      )}

      <ProductTable
        products={filteredProducts}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onRefresh={fetchProducts}
        isLoading={isUpdating}
      />
    </div>
  )
}
