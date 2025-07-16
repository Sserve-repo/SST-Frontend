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
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreatePromotionDialog } from "./create-promotion-dialog";
import { PromotionTable } from "./promotion-table";
import {
  getPromotionStatuses,
  deletePromotions,
} from "@/actions/dashboard/vendors";
<<<<<<< HEAD
import type { Promotion, PromotionStats as Stats } from "@/types/promotions";
=======
import type { Promotion, PromotionStats } from "@/types/promotions";
>>>>>>> origin/lastest-update

export function VendorPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stats, setStats] = useState<PromotionStats>({
    all: 0,
    active: 0,
    expired: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "all";

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

  const mapDiscountsToPromotions = (discounts: any[]): Promotion[] => {
    return discounts.map((promo) => ({
      id: String(promo.id),
      name: promo.discount_name,
      type: promo.discount_type,
      value: Number(promo.discount_value),
      startDate: new Date(promo.start_date),
      endDate: new Date(promo.end_date),
      status: calculateStatus(promo.start_date, promo.end_date, promo.status),
      usageLimit: Number(promo.usage_limit) || 0,
      usageCount: Number(promo.usage_count) || 0,
      description: promo.description || "",
      createdAt: new Date(promo.created_at),
      updatedAt: new Date(promo.updated_at),
    }));
  };

  const fetchPromotionsAndStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPromotionStatuses();
      if (response?.ok) {
        const data = await response.json();
        if (data.status && data.data) {
          const { all_discounts, active, expired, upcoming } = data.data;

          setStats({
            all: all_discounts?.count || 0,
            active: active?.count || 0,
            expired: expired?.count || 0,
            upcoming: upcoming?.count || 0,
          });

          const allMapped = {
            all: mapDiscountsToPromotions(all_discounts?.discounts || []),
            active: mapDiscountsToPromotions(active?.discounts || []),
            expired: mapDiscountsToPromotions(expired?.discounts || []),
            upcoming: mapDiscountsToPromotions(upcoming?.discounts || []),
          };

          const tab = searchParams.get("tab") || "all";
          const filtered = allMapped[tab as keyof typeof allMapped] || [];
          const searchLower = searchTerm.toLowerCase();
          const searched = filtered.filter((p) =>
            p.name.toLowerCase().includes(searchLower)
          );

          setPromotions(searched);
          setTotalPages(Math.ceil(searched.length / itemsPerPage));
        }
      }
    } catch (error) {
      console.error("Error loading promotions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch promotions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, searchTerm, toast]);

  useEffect(() => {
    fetchPromotionsAndStats();
  }, [fetchPromotionsAndStats]);

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleDeletePromotion = async (promotionId: string) => {
    try {
      const response = await deletePromotions(promotionId);
      if (response?.ok) {
        toast({
          title: "Success",
          description: "Promotion deleted.",
        });
        fetchPromotionsAndStats();
      } else throw new Error();
    } catch (err) {
      console.error("Failed to delete promotion:", err);
      
      toast({
        title: "Error",
        description: "Failed to delete promotion.",
        variant: "destructive",
      });
    }
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
          <p className="text-gray-500">Manage your promotional campaigns</p>
        </div>
        <CreatePromotionDialog onSuccess={fetchPromotionsAndStats}>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Create Promotion
          </Button>
        </CreatePromotionDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Promotions"
          count={stats.all}
          Icon={TrendingUp}
        />
        <StatCard
          title="Active"
          count={stats.active}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Upcoming"
          count={stats.upcoming}
          Icon={Calendar}
          color="text-blue-600"
        />
        <StatCard
          title="Expired"
          count={stats.expired}
          Icon={Clock}
          color="text-gray-600"
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({stats.upcoming})
          </TabsTrigger>
          <TabsTrigger value="expired">Expired ({stats.expired})</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab}>
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full" />
            </div>
          ) : promotions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center space-y-2">
                <h3 className="text-lg font-semibold">No promotions found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or create one
                </p>
                <CreatePromotionDialog onSuccess={fetchPromotionsAndStats}>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" /> Create Promotion
                  </Button>
                </CreatePromotionDialog>
              </CardContent>
            </Card>
          ) : (
            <PromotionTable
              promotions={paginatedPromotions}
              onDelete={handleDeletePromotion}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={promotions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
              loading={loading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  count,
  Icon,
  color,
}: {
  title: string;
  count: number;
  Icon: React.ElementType;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center w-full space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color || ""}`}>{count}</div>
        <p className="text-xs text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}
