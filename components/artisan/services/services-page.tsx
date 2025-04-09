"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceTable } from "@/components/artisan/services/service-table";
import { CreateServiceDialog } from "@/components/artisan/services/create-service-dialog";
import { useState } from "react";
import type { Service } from "@/types/services";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Haircut & Styling",
      description: "Professional haircut and styling service",
      price: 50,
      duration: 60,
      images: ["/assets/images/image-placeholder.png"],
      availability: {
        monday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" },
      },
      status: "active",
      category: "",
      createdAt: "",
      featured: false,
      vendor: {
        id: "",
        name: "",
        email: ""
      }
    },
    {
      id: "2",
      name: "Hair Coloring",
      description: "Professional hair coloring service",
      price: 120,
      duration: 120,
      images: ["/assets/images/image-placeholder.png"],
      availability: {
        tuesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        saturday: { start: "09:00", end: "17:00" },
      },
      status: "inactive",
      category: "",
      createdAt: "",
      featured: false,
      vendor: {
        id: "",
        name: "",
        email: ""
      }
    },
  ]);

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
