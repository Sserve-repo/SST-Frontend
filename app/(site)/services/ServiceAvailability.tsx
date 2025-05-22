"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Star,
  MapPin,
  Clock,
  CalendarIcon,
  Server,
  Search,
  ChevronRight,
  Bolt,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { baseUrl } from "@/config/constant";
import { getServicesMenu } from "@/actions/service";
import { useRouter, useSearchParams } from "next/navigation";

interface ServiceProvider {
  id: string;
  user_id: string;
  title: string;
  price: number;
  start_time: string;
  end_time: string;
  city: string;
  province: string;
  description: string;
  image: string;
  service_category_items_name: string;
  service_category_name: string;
  service_duration: string;
  rating?: number;
}

interface ServiceCategory {
  id: number;
  name: string;
  service_category_items: {
    id: number;
    name: string;
    service_category_id: number;
  }[];
}

interface PaginatedResponse {
  current_page: number;
  data: ServiceProvider[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ScheduleRequest {
  date?: Date;
  serviceCategory: string | null;
  serviceCategoryId: number | null;
  serviceSubCategoryId: number | null;
  serviceType: string | null;
  location: string | null;
  locationId: number | null;
  searchQuery: string;
  page: number;
}

export default function ServiceAvailability() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subCategory = searchParams.get("categoryId");
  // const [services, setServices] = useState<ServiceProvider[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState<ServiceProvider[]>(
    []
  );

  const [paginationData, setPaginationData] = useState<{
    currentPage: number;
    lastPage: number;
    total: number;
  }>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const [scheduleRequest, setScheduleRequest] = useState<ScheduleRequest>({
    date: undefined,
    serviceCategory: null,
    serviceCategoryId: null,
    serviceSubCategoryId: null,
    serviceType: null,
    location: null,
    locationId: null,
    searchQuery: "",
    page: 1,
  });

  // For searchable dropdowns
  const [openCategory, setOpenCategory] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [provinces, setProvinces] = useState<
    Array<{ id: number; name: string }>
  >([]);

  // Fetch service categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getServicesMenu();
        if (response?.ok) {
          const data = await response.json();
          const categories = data.data["Service Category Menu"];
          setCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${baseUrl}/general/province/getProvince`);
        if (response.ok) {
          const data = await response.json();
          setProvinces(data.data.Provinces);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleScheduleChange = (field: keyof ScheduleRequest, value: any) => {
    setScheduleRequest((prev) => ({ ...prev, [field]: value }));
  };

  const fetchServices = async (page = 1) => {
    setIsLoading(true);
    try {
      // Build query params for the API call
      const params = new URLSearchParams();

      if (scheduleRequest.serviceSubCategoryId) {
        params.append(
          "sub_service_category",
          scheduleRequest.serviceSubCategoryId.toString()
        );
      }

      if (scheduleRequest.serviceCategoryId) {
        params.append(
          "service_category",
          scheduleRequest.serviceCategoryId.toString()
        );
      }

      if (scheduleRequest.locationId) {
        params.append("province", scheduleRequest.locationId.toString());
      }

      if (scheduleRequest.date) {
        params.append("date", format(scheduleRequest.date, "yyyy-MM-dd"));
      }

      if (scheduleRequest.serviceCategoryId) {
        params.delete("sub_service_category");
      }

      params.append("page", page.toString());

      const url = `${baseUrl}/general/services/getServicesByCategory?${params.toString()}`;
      console.log({ url });

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const servicesData = data.data.Services as PaginatedResponse;

        // setServices(servicesData?.data);
        setFilteredServices(servicesData?.data);

        // Update pagination data
        setPaginationData({
          currentPage: servicesData.current_page,
          lastPage: servicesData.last_page,
          total: servicesData.total,
        });
      } else {
        // setServices([]);
        setFilteredServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subCategory) {
      const parsedSubCategory = parseInt(subCategory, 10);
      // setScheduleRequest((prev) => ({
      //   ...prev,
      //   serviceSubCategoryId: parsedSubCategory,
      //   serviceCategory: null,
      //   serviceCategoryId: null,
      // }));
      setScheduleRequest({serviceSubCategoryId: parsedSubCategory} as any);

      fetchServices(1);
    }
  }, [subCategory]);

  useEffect(() => {
    if (scheduleRequest.serviceSubCategoryId !== null) {
      fetchServices();
    }
  }, [scheduleRequest.serviceSubCategoryId]);

  const handleSearch = useCallback(() => {
    // Reset to page 1 when performing a new search
    setScheduleRequest((prev) => ({ ...prev, page: 1 }));
    fetchServices(1);
  }, [scheduleRequest]);

  const handleReset = useCallback(() => {
    // Reset to page 1 when performing a new search
    setScheduleRequest({
      date: undefined,
      serviceCategory: null,
      serviceCategoryId: null,
      serviceSubCategoryId: null,
      serviceType: null,
      location: null,
      locationId: null,
      searchQuery: "",
      page: 1,
    });
    fetchServices(1);
  }, []);

  const handlePageChange = (page: number) => {
    setScheduleRequest((prev) => ({ ...prev, page }));
    fetchServices(page);
  };

  const handleBookNow = (serviceId: string) => {
    router.push(`/booking/?serviceId=${serviceId}`);
  };

  return (
    <div className="container flex justify-start items-center flex-col min-h-screen mx-auto p-4 max-w-7xl py-12">
      <div className="w-full mb-8">
        <h2 className="text-3xl font-semibold my-4 text-center text-primary">
          Check Service Availability
        </h2>

        {/* Enhanced Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Text search input */}
            <div className="w-full">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search by title, description, service type..."
                  className="pl-10 w-full"
                  value={scheduleRequest.searchQuery}
                  onChange={(e) =>
                    handleScheduleChange("searchQuery", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date Selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduleRequest.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleRequest.date ? (
                      format(scheduleRequest.date, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduleRequest.date}
                    onSelect={(date) => handleScheduleChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Searchable Service Category Selector */}
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center">
                      <Server className="mr-2 h-4 w-4" />
                      {scheduleRequest.serviceCategory || "Select category"}
                    </div>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => {
                            handleScheduleChange(
                              "serviceCategory",
                              category.name
                            );
                            handleScheduleChange(
                              "serviceCategoryId",
                              category.id
                            );
                            setOpenCategory(false);
                          }}
                        >
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Searchable Location Selector */}
              <Popover open={openLocation} onOpenChange={setOpenLocation}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openLocation}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {scheduleRequest.location || "Select location"}
                    </div>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search locations..." />
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {provinces.map((province) => (
                        <CommandItem
                          key={province.id}
                          value={province.name}
                          onSelect={() => {
                            handleScheduleChange("location", province.name);
                            handleScheduleChange("locationId", province.id);
                            setOpenLocation(false);
                          }}
                        >
                          {province.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <div className="flex justify-end mt-2 space-x-3">
              <Button
                onClick={handleReset}
                className="w-full md:w-auto"
                size="lg"
              >
                <Bolt />
                Reset
              </Button>

              <Button
                onClick={handleSearch}
                className="w-full md:w-auto"
                size="lg"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Service List */}
        <div className="grid grid-cols-1 gap-6 w-full">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="overflow-hidden border border-gray-200"
              >
                <div className="flex flex-col md:flex-row animate-pulse">
                  <div className="p-6 flex-grow">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-[100px] h-[100px] rounded-md bg-gray-200" />
                      <div className="space-y-3 flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-20" />
                      <div className="h-6 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 w-[200px] space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded w-full mt-auto" />
                  </div>
                </div>
              </Card>
            ))
          ) : filteredServices?.length > 0 ? (
            filteredServices?.map((provider) => (
              <Card
                key={provider.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-grow">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="w-[100px] h-[100px] rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img
                          src={provider.image || "/placeholder.svg"}
                          alt={provider.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-primary">
                          {provider.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">
                          {provider.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-accent/50">
                            {provider.service_category_items_name}
                          </Badge>
                          <Badge variant="secondary" className="bg-accent/50">
                            {provider.service_category_name}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-x-4 items-center mt-4">
                      <div className="flex items-center">
                        <span className="font-semibold text-lg text-primary">
                          ${provider.price}
                        </span>
                      </div>
                      {provider.rating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm">
                            {provider.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-6 flex flex-col justify-between md:w-[200px]">
                    <div>
                      <div className="flex items-center mb-3">
                        <Clock className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-sm">
                          {provider.service_duration} hrs
                        </span>
                      </div>
                      <div className="flex items-center mb-4">
                        <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-sm truncate">
                          {provider.city}, {provider.province}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="mt-auto"
                      onClick={() => handleBookNow(provider.id)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No services found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>

        {/* Pagination component */}
        {filteredServices?.length > 0 && (
          <Pagination className="mt-8">
            <PaginationContent>
              {paginationData?.currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(paginationData?.currentPage - 1)
                    }
                    href="#"
                  />
                </PaginationItem>
              )}

              {/* First page */}
              {paginationData?.lastPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={paginationData?.currentPage === 1}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis for many pages */}
              {paginationData?.currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Pages around current page */}
              {paginationData?.lastPage > 1 &&
                Array.from(
                  { length: Math.min(3, paginationData?.lastPage) },
                  (_, i) => {
                    const pageNum = Math.max(
                      2,
                      Math.min(
                        paginationData?.currentPage - 1 + i,
                        paginationData?.lastPage - 1
                      )
                    );
                    // Only show if it's not the first or last page
                    if (pageNum > 1 && pageNum < paginationData?.lastPage) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={pageNum === paginationData?.currentPage}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  }
                ).filter(Boolean)}

              {/* Ellipsis for many pages */}
              {paginationData.currentPage < paginationData.lastPage - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page */}
              {paginationData.lastPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={
                      paginationData.currentPage === paginationData.lastPage
                    }
                    onClick={() => handlePageChange(paginationData.lastPage)}
                  >
                    {paginationData.lastPage}
                  </PaginationLink>
                </PaginationItem>
              )}

              {paginationData.currentPage < paginationData.lastPage && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(paginationData.currentPage + 1)
                    }
                    href="#"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
