"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounced-search";
import { CreatePromotionDialog } from "./create-promotion-dialog";
import { PromotionTable } from "./promotion-table";
import {
  getPromotions,
  getPromotionStatuses,
  deletePromotions,
} from "@/actions/dashboard/artisans";
import type { Promotion, PromotionStats as Stats } from "@/types/promotions";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stats, setStats] = useState<Stats>({
    all: 0,
    active: 0,
    expired: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPromotions, setTotalPromotions] = useState(0);

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const currentTab = searchParams.get("tab") || "all";
  const itemsPerPage = 10;

  const fetchPromotions = useCallback(async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      const response = await getPromotions(page, itemsPerPage, search);

      if (!response?.ok) {
        throw new Error("Failed to fetch promotions");
      }

      const data = await response.json();

      console.log("Fetched promotions data:", data);

      if (data.status && data.data) {
        const allPromotions = data.data.all_discounts || [];

        const transformedPromotions: Promotion[] = allPromotions.map(
          (promo: any) => ({
            id: String(promo.id),
            name: promo.discount_name,
            type: promo.discount_type,
            value: Number(promo.discount_value),
            startDate: new Date(promo.start_date),
            endDate: new Date(promo.end_date),
            status: calculateStatus(
              promo.start_date,
              promo.end_date,
              promo.status
            ),
            usageLimit: Number(promo.usage_limit) || 0,
            usageCount: Number(promo.usage_count) || 0,
            description: promo.description || "",
            createdAt: new Date(promo.created_at),
            updatedAt: new Date(promo.updated_at),
          })
        );

        // Filter by status if not "all"
        const filteredPromotions =
          status === "all"
            ? transformedPromotions
            : transformedPromotions.filter((p) => p.status === status);

        setPromotions(filteredPromotions);
        setTotalPromotions(filteredPromotions.length);
        setTotalPages(Math.ceil(filteredPromotions.length / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast({
        title: "Error",
        description: "Failed to load promotions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchStats = async () => {
    try {
      const response = await getPromotionStatuses();
      if (response?.ok) {
        const data = await response.json();
        if (data.status && data.data) {
          setStats({
            all: data.data.all?.count || 0,
            active: data.data.active?.count || 0,
            expired: data.data.expired?.count || 0,
            upcoming: data.data.upcoming?.count || 0,
          });
        }

      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const calculateStatus = (
    startDate: string,
    endDate: string,
    apiStatus: string
  ): Promotion["status"] => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (apiStatus === "disabled") return "disabled";
    if (now < start) return "upcoming";
    if (now > end) return "expired";
    return "active";
  };

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const tab = searchParams.get("tab") || "all";
    setCurrentPage(page);
    fetchPromotions(page, debouncedSearchTerm, tab);
    fetchStats();
  }, [debouncedSearchTerm, searchParams, fetchPromotions]);

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    if (searchTerm) params.set("search", searchTerm);
    router.push(`?${params.toString()}`);
  };

  const handleDeletePromotion = async (promotionId: string) => {
    try {
      const response = await deletePromotions(promotionId);
      if (response?.ok) {
        setPromotions(promotions.filter((p) => p.id !== promotionId));
        toast({
          title: "Success",
          description: "Promotion deleted successfully",
        });
        fetchStats(); // Refresh stats
      } else {
        throw new Error("Failed to delete promotion");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast({
        title: "Error",
        description: "Failed to delete promotion. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreatePromotion = () => {
    fetchPromotions(currentPage, debouncedSearchTerm, currentTab);
    fetchStats();
  };

  const paginatedPromotions = promotions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Promotions & Discounts
          </h1>
          <p className="text-gray-500">
            Manage your promotional campaigns and discount codes
          </p>
        </div>

        <CreatePromotionDialog onSuccess={handleCreatePromotion}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </CreatePromotionDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Promotions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.all}</div>
            <p className="text-xs text-muted-foreground">All promotions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.upcoming}
            </div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.expired}
            </div>
            <p className="text-xs text-muted-foreground">Past promotions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search promotions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs and Table */}
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({stats.upcoming})
          </TabsTrigger>
          <TabsTrigger value="expired">Expired ({stats.expired})</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab}>
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No promotions found</p>
            </div>
          ) : (
            <PromotionTable
              promotions={paginatedPromotions}
              onDelete={handleDeletePromotion}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalPromotions}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
