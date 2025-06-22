"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceTable } from "@/components/artisan/services/service-table";
import { CreateServiceDialog } from "@/components/artisan/services/create-service-dialog";
import { useEffect, useState } from "react";
import type { Service } from "@/types/services";
import {
  createServiceListing,
  getserviceListings,
} from "@/actions/dashboard/artisans";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFetchServiceListings = async () => {
    try {
      setIsLoading(true);
      const response = await getserviceListings();
      if (!response?.ok) throw Error("Cannot fetch services");

      const data = await response.json();
      const { serviceListing } = data.data;

      const transformed =
        serviceListing?.map((item: any) => ({
          id: item?.id,
          name: item?.title,
          description: item?.description,
          price: item?.price,
          duration: item?.service_duration,
          images: [item?.image],
          availability: {
            monday: { start: "09:00", end: "17:00" },
            wednesday: { start: "09:00", end: "17:00" },
            friday: { start: "09:00", end: "17:00" },
          },
          status: item?.status === 1 ? "active" : "inactive",
          category: "",
          createdAt: item?.created_at || "",
          featured: false,
          vendor: {
            id: item?.vendor_id || "",
            name: item?.vendor_name || "",
            email: item?.vendor_email || "",
          },
          reviews: item?.reviews || [],
        })) || [];

      setServices(transformed);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchServiceListings();
  }, []);

  const handleCreateService = async (newService: Omit<any, "id">) => {
    try {
      const form = new FormData();
      form.append("title", newService.name);
      form.append("description", newService.description);
      form.append("price", newService.price);
      form.append("start_time", newService.availableFrom);
      form.append("end_time", newService.availableTo);
      form.append("available_dates", newService.availability);
      form.append("service_duration", String(newService.duration));
      form.append("home_service_availability", newService.homeService);
      newService.images.forEach((file: File, i: number) => {
        form.append(`images[${i}]`, file);
      });
      form.append("status", newService.status);

      const response = await createServiceListing(form);
      if (!response?.ok) throw new Error("Service creation failed");

      const result = await response.json();
      const data = result.data.listingDetail;

      const newEntry: Service = {
        id: data.id,
        name: data.title,
        description: data.description,
        price: data.price,
        duration: data.service_duration,
        images: [data.image],
        availability: {
          monday: { start: "09:00", end: "17:00" }
          // Add other days as needed
        },
        status: "inactive",
        category: "",
        createdAt: data.created_at || "",
        featured: false,
        vendor: {
          id: data.vendor_id || "",
          name: data.vendor_name || "",
          email: data.vendor_email || "",
        },
        reviews: [],
      };

      setServices((prev) => [...prev, newEntry]);
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleUpdateService = (updated: Service) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manage Services</h1>
          <p className="text-gray-500">
            Create and manage your service offerings
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <CreateServiceDialog onSubmit={handleCreateService}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </CreateServiceDialog>
        </div>
      </div>

      <ServiceTable
        services={filteredServices}
        isLoading={isLoading}
        onUpdate={handleUpdateService}
        onDelete={handleDeleteService}
      />
    </div>
  );
}
