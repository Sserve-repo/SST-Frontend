"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceTable } from "@/components/artisan/services/service-table";
import { CreateServiceDialog } from "@/components/artisan/services/create-service-dialog";
import { useEffect, useState } from "react";
import type { Service } from "@/types/services";
import { getserviceListings } from "@/actions/dashboard/artisans";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const handleFetchServiceListings = async () => {
    try {
      const response = await getserviceListings();
      if (!response?.ok) {
        throw Error("Cannot fetch analytics data");
      }
      const data = await response.json();

      const { serviceListing } = data.data;
      const transformedServiceList = serviceListing?.map((item) => {
        return {
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
          status: item?.status === 1 ? "active" : "disabled",
          category: "",
          createdAt: "",
          featured: false,
          vendor: {
            id: "",
            name: "",
            email: "",
          },
        };
      });
      setServices(transformedServiceList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchServiceListings();
  }, []);

  const handleCreateService = (newService: Omit<Service, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setServices([...services, { ...newService, id }]);
  };

  const handleUpdateService = (updatedService: Service) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manage Services</h1>
          <p className="text-gray-500">
            Create and manage your service offerings
          </p>
        </div>
        <CreateServiceDialog onSubmit={handleCreateService}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </CreateServiceDialog>
      </div>

      <ServiceTable
        services={services}
        onUpdate={handleUpdateService}
        onDelete={handleDeleteService}
      />
    </div>
  );
}
