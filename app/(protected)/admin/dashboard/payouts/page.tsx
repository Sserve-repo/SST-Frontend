"use client";

import { useState, useEffect, useCallback } from "react";
import { PayoutTable } from "@/components/admin/payouts/payout-table";
import { PayoutStats } from "@/components/admin/payouts/payout-stats";
import { PayoutFilters } from "@/components/admin/payouts/payout-filters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUrlFilters } from "@/hooks/use-url-filters";
import {
  getPendingPayouts,
  getCompletedPayouts,
  processPayout,
  type PendingPayout,
  type CompletedPayout,
} from "@/actions/admin/payout-api";

interface AdminPayoutStats {
  totalPending: number;
  totalCompleted: number;
  pendingAmount: number;
  completedAmount: number;
}

export default function PayoutsPage() {
  const { filters, updateFilters, clearFilters } = useUrlFilters();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingPayouts, setPendingPayouts] = useState<PendingPayout[]>([]);
  const [completedPayouts, setCompletedPayouts] = useState<CompletedPayout[]>(
    []
  );
  const [stats, setStats] = useState<AdminPayoutStats>({
    totalPending: 0,
    totalCompleted: 0,
    pendingAmount: 0,
    completedAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchPendingPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: apiError } = await getPendingPayouts();
      console.log("Fetching pending payouts:", data, apiError);
      
      if (apiError || !data) {
        throw new Error(apiError || "Failed to fetch pending payouts");
      }

      console.log("Fetched pending payouts data:", data);
      
      // Access the correct data structure based on the API response
      const pendingPayoutsData = data.pendingPayouts || [];
      const totalPendingPayout = data.totalPendingPayout || 0;
      const totalCompletedPayout = data.totalCompletedPayout || 0;
      
      setPendingPayouts(pendingPayoutsData);
      setStats((prev) => ({
        ...prev,
        totalPending: pendingPayoutsData.length,
        pendingAmount: totalPendingPayout,
        completedAmount: totalCompletedPayout,
      }));
    } catch (err) {
      console.error("Error fetching pending payouts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch pending payouts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompletedPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: apiError } = await getCompletedPayouts();
      console.log("Fetching completed payouts:", data, apiError);

      if (apiError || !data) {
        throw new Error(apiError || "Failed to fetch completed payouts");
      }

      console.log("Fetched completed payouts data:", data);
      
      // Access the correct data structure
      const completedPayoutsData = data.completedPayouts || [];
      
      setCompletedPayouts(completedPayoutsData);
      setStats((prev) => ({
        ...prev,
        totalCompleted: completedPayoutsData.length,
      }));
    } catch (err) {
      console.error("Error fetching completed payouts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch completed payouts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch both pending and completed payouts for accurate stats
  const fetchAllPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both pending and completed payouts
      const [pendingResult, completedResult] = await Promise.all([
        getPendingPayouts(),
        getCompletedPayouts()
      ]);

      console.log("Fetching all payouts:", { pendingResult, completedResult });

      // Handle pending payouts
      if (pendingResult.error || !pendingResult.data) {
        console.error("Error fetching pending payouts:", pendingResult.error);
      } else {
        const pendingData = pendingResult.data.pendingPayouts || [];
        const totalPendingPayout = pendingResult.data.totalPendingPayout || 0;
        const totalCompletedPayout = pendingResult.data.totalCompletedPayout || 0;
        
        setPendingPayouts(pendingData);
        setStats(prev => ({
          ...prev,
          totalPending: pendingData.length,
          pendingAmount: totalPendingPayout,
          completedAmount: totalCompletedPayout,
        }));
      }

      // Handle completed payouts
      if (completedResult.error || !completedResult.data) {
        console.error("Error fetching completed payouts:", completedResult.error);
      } else {
        const completedData = completedResult.data.completedPayouts || [];
        
        setCompletedPayouts(completedData);
        setStats(prev => ({
          ...prev,
          totalCompleted: completedData.length,
        }));
      }

    } catch (err) {
      console.error("Error fetching all payouts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch payouts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchAllPayouts();
  }, [fetchAllPayouts]);

  // Handle tab changes - no need to refetch if data is already loaded
  useEffect(() => {
    // Only refetch if we don't have data for the current tab
    if (activeTab === "pending" && pendingPayouts.length === 0) {
      fetchPendingPayouts();
    } else if (activeTab === "completed" && completedPayouts.length === 0) {
      fetchCompletedPayouts();
    }
  }, [activeTab, pendingPayouts.length, completedPayouts.length, fetchPendingPayouts, fetchCompletedPayouts]);

  const handleProcessPayout = async (userId: number) => {
    setIsProcessing(true);
    try {
      const { data, error: apiError } = await processPayout(userId);

      if (apiError || !data?.payout) {
        throw new Error(apiError || "Failed to process payout");
      }

      toast({
        title: "Success",
        description: "Payout processed successfully.",
      });

      // Refresh all payouts to update stats and move processed payout to completed
      await fetchAllPayouts();
    } catch (err) {
      console.error("Error processing payout:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to process payout",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFiltersChange = useCallback(
    (newFilters: { search: string; type: string }) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  const filteredPendingPayouts = pendingPayouts.filter((payout) => {
    const matchesSearch = filters.search
      ? payout.user_name.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    const matchesType = filters.type
      ? payout.payout === filters.type
      : true;
    return matchesSearch && matchesType;
  });

  const filteredCompletedPayouts = completedPayouts.filter((payout) => {
    const matchesSearch = filters.search
      ? payout.user_name.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    const matchesType = filters.type ? payout.payout === filters.type : true;
    return matchesSearch && matchesType;
  });

  const itemsPerPage = 10;
  const currentPage = Number.parseInt(filters.page as string) || 1;
  const totalPendingPages = Math.ceil(
    filteredPendingPayouts.length / itemsPerPage
  );
  const totalCompletedPages = Math.ceil(
    filteredCompletedPayouts.length / itemsPerPage
  );

  const paginatedPendingPayouts = filteredPendingPayouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedCompletedPayouts = filteredCompletedPayouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    updateFilters({ ...filters, page: page.toString() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Payout Management
        </h1>
        <p className="text-muted-foreground">
          Manage and process vendor and artisan payouts
        </p>
      </div>

      <PayoutStats stats={stats} />

      <PayoutFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        onClearFilters={clearFilters}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="pending">
            Pending Payouts ({stats.totalPending})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Payouts ({stats.totalCompleted})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchPendingPayouts} />
          ) : filteredPendingPayouts.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">No pending payouts found.</p>
              <Button variant="link" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <PayoutTable
              payouts={paginatedPendingPayouts}
              type="pending"
              onProcessPayout={handleProcessPayout}
              isProcessing={isProcessing}
              selectedIds={selectedIds}
              onSelectedIdsChange={setSelectedIds}
              currentPage={currentPage}
              totalPages={totalPendingPages}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchCompletedPayouts} />
          ) : filteredCompletedPayouts.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                No completed payouts found.
              </p>
              <Button variant="link" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <PayoutTable
              payouts={paginatedCompletedPayouts}
              type="completed"
              selectedIds={selectedIds}
              onSelectedIdsChange={setSelectedIds}
              currentPage={currentPage}
              totalPages={totalCompletedPages}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
