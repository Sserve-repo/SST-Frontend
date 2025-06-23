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
  type Product,
  type ProductListResponse,
} from "@/actions/admin/product-api";

interface ProductStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface Filters {
  category: string;
  status: string;
  search: string;
}

export default function ProductApprovalPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    category: "",
    status: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reload, setReload] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const { toast } = useToast();

  const getStatusFromNumber = (
    status: number
  ): "pending" | "approved" | "inactive" | "active" | "rejected" => {
    switch (status) {
      case 1:
        return "approved";
      case 2:
        return "rejected";
      case 3:
        return "inactive";
      default:
        return "pending";
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: pageSize.toString(),
      };
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const response: ProductListResponse = await getProducts(params);

      if (!response || !response.data?.productListing) {
        throw new Error(response.message || "No products found");
      }

      const formattedProducts: IProduct[] = response.data.productListing.map(
        (product: Product): IProduct => ({
          id: product.id.toString(),
          name: product.title,
          description: product.description,
          category: product.category?.name || "Uncategorized",
          price: parseFloat(product.price),
          vendor: {
            id: product.user_id.toString(),
            name: product.vendor_name || "Vendor Name",
            email: product.vendor_email || "vendor@email.com",
          },
          status: getStatusFromNumber(product.status),
          featured: Boolean(product.featured),
          images: product.image
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
      setCategories(uniqueCategories); // ✅ Save to state

      if (response.data.listingCounts) {
        const counts = response.data.listingCounts;
        setStats({
          total: counts.allProducts || 0,
          pending: counts.pendingProducts || 0,
          approved: counts.approvedProducts || 0,
          rejected: counts.rejectedProducts || 0,
        });
        setTotalPages(Math.ceil((counts.allProducts || 1) / pageSize));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, reload]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset pagination
  }, []);

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
      const productIds = selectedIds.map((id) => parseInt(id));

      if (action === "feature") {
        toast({
          title: "Feature Coming Soon",
          description: "Feature functionality is under development.",
        });
        return;
      }

      // Define status mapping if your API expects numbers or specific strings
      const statusMap = {
        approve: "approved",
        reject: "rejected",
        disable: "inactive",
      };

      const result = await updateProductStatus({
        status: statusMap[action],
        product_ids: productIds,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: `Successfully ${action}d ${selectedIds.length} product(s).`,
      });

      setSelectedIds([]);
      setReload((prev) => prev + 1); // trigger re-fetch
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                  : "Declined products"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProductFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        categories={categories}
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
        <ErrorMessage message={error} onRetry={() => setReload((r) => r + 1)} />
      ) : products.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
          <Button
            variant="link"
            onClick={() => setFilters({ category: "", status: "", search: "" })}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <ProductTable
          products={products}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          onRefresh={() => setReload((r) => r + 1)}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
