"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BulkActionsToolbar } from "@/components/admin/products/bulk-actions-toolbar";
import { ProductTable } from "@/components/admin/products/product-table";
import { ProductFilters } from "@/components/admin/products/product-filters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import type { IProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, Package } from "lucide-react";
import {
  getProducts,
  updateProductStatus,
  updateProductFeatureStatus,
  type Product,
} from "@/actions/admin/product-api";
import { useUrlFilters } from "@/hooks/use-url-filters";

interface ProductStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  disabled: number;
}

export default function ProductApprovalPage() {
  const { filters, updateFilters, clearFilters } = useUrlFilters();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    disabled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10,
  });

  const { toast } = useToast();

  const getStatusFromNumber = (
    status: number
  ):
    | "pending"
    | "approved"
    | "inactive"
    | "active"
    | "rejected"
    | "disabled" => {
    switch (status) {
      case 1:
        return "approved";
      case 2:
        return "rejected";
      case 3:
        return "disabled";
      default:
        return "pending";
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};

      // Only add non-empty filter values
      if (filters.page && filters.page !== "1") params.page = filters.page;
      if (filters.limit && filters.limit !== "10") params.limit = filters.limit;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const { data, error: apiError } = await getProducts(params);

      if (apiError || !data?.productListing) {
        throw new Error(apiError || "No products found");
      }

      const apiData = data;
      const formattedProducts: IProduct[] = apiData.productListing.map(
        (product: Product): IProduct => ({
          id: product.id.toString(),
          name: product.title,
          description: product.description,
          category: product.category?.name || "Uncategorized",
          subcategory: product.subcategory?.name,
          price: Number.parseFloat(product.price),
          stockLevel: product.stock_level,
          vendor: {
            id: product.user_id.toString(),
            name: product.vendor_name || "Vendor Name",
            email: product.vendor_email || "vendor@email.com",
          },
          status: getStatusFromNumber(product.status),
          featured: Boolean(product.is_featured),
          images:
            product.product_images && product.product_images.length > 0
              ? product.product_images
              : product.image
              ? [product.image]
              : ["/assets/images/image-placeholder.png"],
          createdAt: product.created_at,
          duration: 0,
        })
      );

      setProducts(formattedProducts);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(formattedProducts.map((p) => p.category))
      );
      setCategories(uniqueCategories);

      // Update pagination from API response
      setPagination({
        currentPage: apiData.current_page || Number.parseInt(filters.page) || 1,
        totalPages: apiData.last_page || 1,
        total: apiData.total || formattedProducts.length,
        perPage: apiData.per_page || Number.parseInt(filters.limit) || 10,
      });

      // Update stats
      if (apiData.listingCounts) {
        const counts = apiData.listingCounts;
        setStats({
          total: counts.allProducts || 0,
          pending: counts.pendingProducts || 0,
          approved: counts.approvedProducts || 0,
          rejected: counts.rejectedProducts || 0,
          disabled: counts.disabledProducts || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.page,
    filters.limit,
    filters.category,
    filters.status,
    filters.search,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFiltersChange = useCallback(
    (newFilters: { category: string; status: string; search: string }) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page: page.toString() });
    },
    [updateFilters]
  );

  const handleBulkAction = async (
    action: "approve" | "reject" | "disable" | "feature"
  ) => {
    if (selectedIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select products.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const productIds = selectedIds.map((id) => Number.parseInt(id));

      if (action === "feature") {
        const result = await updateProductFeatureStatus({
          product_ids: productIds,
          is_featured: true,
        });

        if (result?.error) {
          throw new Error(result.error);
        }
      } else {
        const statusMap = {
          approve: "approved",
          reject: "rejected",
          disable: "disabled",
        };

        const result = await updateProductStatus({
          status: statusMap[action],
          product_ids: productIds,
        });

        if (result?.error) {
          throw new Error(result.error);
        }
      }

      toast({
        title: "Success",
        description: `Successfully ${action}d ${selectedIds.length} product(s).`,
      });

      setSelectedIds([]);
      await fetchProducts();
    } catch (err) {
      console.error(`Failed to ${action} products:`, err);
      toast({
        title: "Error",
        description: `Failed to ${action} selected products.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Product Approval
        </h1>
        <p className="text-muted-foreground">
          Review and manage product listings awaiting approval.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          {
            title: "Total Products",
            icon: <Package className="h-4 w-4 text-muted-foreground" />,
            value: stats.total,
            color: "text-muted-foreground",
          },
          {
            title: "Pending Approval",
            icon: <Clock className="h-4 w-4 text-yellow-600" />,
            value: stats.pending,
            color: "text-yellow-600",
          },
          {
            title: "Approved",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            value: stats.approved,
            color: "text-green-600",
          },
          {
            title: "Rejected",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
            value: stats.rejected,
            color: "text-red-600",
          },
          {
            title: "Disabled",
            icon: <XCircle className="h-4 w-4 text-gray-600" />,
            value: stats.disabled,
            color: "text-gray-600",
          },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.title === "Total Products"
                  ? "All product listings"
                  : stat.title === "Pending Approval"
                  ? "Awaiting review"
                  : stat.title === "Approved"
                  ? "Live products"
                  : stat.title === "Rejected"
                  ? "Declined products"
                  : "Inactive products"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProductFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        categories={categories}
        onClearFilters={clearFilters}
      />

      {selectedIds.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onApprove={() => handleBulkAction("approve")}
          onReject={() => handleBulkAction("reject")}
          onDisable={() => handleBulkAction("disable")}
          onFeature={() => handleBulkAction("feature")}
          isLoading={isUpdating}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
          <Button variant="link" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ProductTable
          products={products}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          onRefresh={fetchProducts}
          isLoading={isUpdating}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
