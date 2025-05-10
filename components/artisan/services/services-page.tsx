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
          status: item?.status === 1 ? "active" : "inactive",
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

  //   {
  //     "status": true,
  //     "status_code": 201,
  //     "message": "Service Listing Created Successfully",
  //     "data": {
  //         "listingDetail": {
  //             "user_id": 7,
  //             "title": "Plumbing",
  //             "service_category_id": 4,
  //             "service_category_items_id": 12,
  //             "price": "371",
  //             "service_duration": 60.5,
  //             "description": "knfkn knknfknv fknkf knf",
  //             "image": "https:\/\/res.cloudinary.com\/dhb04asqy\/image\/upload\/v1746860527\/service_image\/ibizghd6nhhj0dqemptk.jpg",
  //             "available_dates": null,
  //             "start_time": "08:01",
  //             "end_time": "00:05",
  //             "home_service_availability": "true",
  //             "updated_at": "2025-05-10T07:02:09.000000Z",
  //             "created_at": "2025-05-10T07:02:09.000000Z",
  //             "id": 14
  //         }
  //     },
  //     "token": null,
  //     "debug": null
  // }
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
      form.append("home_service_availability", newService.homeService); // Update if dynamic

      newService.images.forEach((file: File, index: number) => {
        form.append(`images[${index}]`, file);
      });

      form.append("status", newService.status);

      const response = await createServiceListing(form);

      if (!response?.ok) {
        const errorData = await response?.json();
        console.error("Failed to create service:", errorData);
        throw new Error("Service creation failed");
      }

      const waitedResponse = await response.json();
      const data = waitedResponse.data.listingDetail;

      const transformedResponse = {
        id: data?.id,
        name: data?.title,
        description: data?.description,
        price: data?.price,
        duration: data?.service_duration,
        images: [data?.image],
        availability: {
          monday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "17:00" },
        },
        status: "inactive",
        category: "",
        createdAt: "",
        featured: false,
        vendor: {
          id: "",
          name: "",
          email: "",
        },
      };

      setServices((prev) => [...prev, transformedResponse as Service]);
    } catch (error) {
      console.error("Error creating service:", error);
      // Optionally show user-friendly feedback
    }
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
