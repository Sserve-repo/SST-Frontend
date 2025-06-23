"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getDashboardOverview} from "@/actions/admin/dashboard-api";

export function TopServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getDashboardOverview();
        if (data?.Overview?.mostBookedServices) {
          setServices(data.Overview.mostBookedServices);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Booked Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Top Booked Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.service_listing_detail_id}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{service.title}</p>
                  <span className="text-sm text-muted-foreground">
                    ${service.total_amount?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={service.booking_percentage || 0}
                    className="h-2"
                  />
                  <span className="text-sm text-muted-foreground">
                    {service.booking_percentage || 0}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {service.total_bookings || 0} bookings
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No service data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
