"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  MapPin,
  Clock,
  CalendarIcon,
  Server,
  Search,
  ChevronRight,
  Bolt,
  Heart,
  Calendar as CalendarLucide,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import Cookies from "js-cookie";

// API Base URL Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.sserves.com/api/v1";

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
  is_favorite?: boolean;
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

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export default function ServiceAvailability() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subCategory = searchParams.get("categoryId");

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState<ServiceProvider[]>(
    []
  );
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // Check if user is logged in
  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Handle search with backend API (debounced)
  const handleSearchQuery = useCallback(
    debounce((query: string) => {
      setScheduleRequest((prev) => ({ ...prev, searchQuery: query, page: 1 }));
      fetchServices(1);
    }, 500),
    []
  );

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

  const fetchServices = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        // Build query params for the API call
        const params = new URLSearchParams();

        // If no specific category filters, fetch all services
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

        if (scheduleRequest.searchQuery.trim()) {
          params.append("search", scheduleRequest.searchQuery.trim());
        }

        params.append("page", page.toString());

        // Use appropriate endpoint based on whether we have filters
        const hasFilters =
          scheduleRequest.serviceSubCategoryId ||
          scheduleRequest.serviceCategoryId ||
          scheduleRequest.locationId ||
          scheduleRequest.date ||
          scheduleRequest.searchQuery.trim();

        const endpoint = hasFilters
          ? `${baseUrl}/general/services/getServicesByCategory`
          : `${baseUrl}/general/services/getServicesByCategory`;

        const url = `${endpoint}?${params.toString()}`;
        console.log({ url });

        const response = await fetch(url, {
          headers:{
            "Authorization": `Bearer ${Cookies.get("accessToken")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const servicesData = data.data.Services as PaginatedResponse;
          console.log({servicesData})
          setFilteredServices(servicesData as any || []);

          // Update pagination data
          setPaginationData({
            currentPage: servicesData.current_page,
            lastPage: servicesData.last_page,
            total: servicesData.total,
          });
        } else {
          setFilteredServices([]);
          setPaginationData({ currentPage: 1, lastPage: 1, total: 0 });
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setFilteredServices([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      scheduleRequest.serviceSubCategoryId,
      scheduleRequest.serviceCategoryId,
      scheduleRequest.locationId,
      scheduleRequest.date,
      scheduleRequest.searchQuery,
    ]
  );

  // Handle favorite toggle
  const handleFavoriteToggle = async (
    serviceId: string,
    currentFavoriteStatus: boolean
  ) => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();
      formData.append("item_type", "service");
      formData.append("item_id", serviceId);

      const endpoint = currentFavoriteStatus
        ? `${API_BASE_URL}/general/removeFavoriteItem`
        : `${API_BASE_URL}/general/addFavoriteItem`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        // Update the service's favorite status in local state
        setFilteredServices((prevServices) =>
          prevServices.map((service) =>
            service.id === serviceId
              ? { ...service, is_favorite: !currentFavoriteStatus }
              : service
          )
        );

        const message = currentFavoriteStatus
          ? "Removed from favorites"
          : "Added to favorites";
        // You can replace this with a toast notification
        console.log(message);
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  };

  // Initial load - fetch all services if no category specified
  useEffect(() => {
    if (subCategory) {
      const parsedSubCategory = parseInt(subCategory, 10);
      setScheduleRequest((prev) => ({
        ...prev,
        serviceSubCategoryId: parsedSubCategory,
      }));
    } else {
      // No category specified, fetch all services
      fetchServices(1);
    }
  }, [subCategory, fetchServices]);

  // Fetch services when category changes
  useEffect(() => {
    if (scheduleRequest.serviceSubCategoryId !== null || subCategory) {
      fetchServices();
    }
  }, [scheduleRequest.serviceSubCategoryId, fetchServices, subCategory]);

  const handleSearch = useCallback(() => {
    setScheduleRequest((prev) => ({ ...prev, page: 1 }));
    fetchServices(1);
  }, [fetchServices]);

  const handleReset = useCallback(() => {
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
  }, [fetchServices]);

  const handlePageChange = (page: number) => {
    setScheduleRequest((prev) => ({ ...prev, page }));
    fetchServices(page);
  };

  const handleBookNow = (serviceId: string) => {
    router.push(`/booking/?serviceId=${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#502266] mb-2">
            Find the Perfect Service
          </h1>
          <p className="text-gray-600 text-lg">
            Discover quality services from verified professionals
          </p>
        </div>

        {/* Enhanced Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Text search input */}
            <div className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search services by title, description, or category..."
                  className="pl-10 pr-16 focus:ring-[#502266] focus:border-[#502266]"
                  value={scheduleRequest.searchQuery}
                  onChange={(e) => {
                    handleScheduleChange("searchQuery", e.target.value);
                    handleSearchQuery(e.target.value);
                  }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-[#502266] hover:bg-[#502266]/90"
                  onClick={handleSearch}
                >
                  <Search className="h-3 w-3" />
                </Button>
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Bolt className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleSearch}
                className="bg-[#502266] hover:bg-[#502266]/90 flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#502266]">
            Available Services
          </h2>
          <Badge variant="outline" className="text-sm">
            {paginationData.total} services found
          </Badge>
        </div>

        {/* Service Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredServices?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card
                  className={`overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                    hoveredCard === service.id ? "scale-105" : "hover:scale-105"
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={service.image || "/assets/images/tailor.png"}
                        alt={service.title}
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Price Badge */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-[#FF7F00] text-white border-none text-xs">
                          ${service.price}
                        </Badge>
                      </div>

                      {/* Favorite Button */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          className={`h-8 w-8 rounded-full transition-all duration-300 ${
                            service.is_favorite
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-white/90 text-gray-600 hover:bg-white"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(
                              service.id,
                              service.is_favorite || false
                            );
                          }}
                        >
                          <Heart
                            className={`h-3 w-3 transition-all duration-300 ${
                              service.is_favorite ? "fill-current" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-[#240F2E] text-white p-3 relative overflow-hidden">
                      <div className="relative z-10">
                        <h3 className="text-sm font-semibold text-[#FF7F00] mb-1 line-clamp-2 group-hover:text-white transition-colors duration-300">
                          {service.title}
                        </h3>

                        <Badge
                          variant="secondary"
                          className="mb-2 bg-white/10 text-white border-white/20 text-xs"
                        >
                          {service.service_category_items_name}
                        </Badge>

                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{service.service_duration}hrs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-16">
                              {service.city}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs flex items-center">
                            ⭐⭐⭐⭐⭐
                            <span className="ml-1">(4.5)</span>
                          </p>
                          <span className="text-[#FF7F00] font-semibold text-sm">
                            ${service.price}
                          </span>
                        </div>

                        <Button
                          onClick={() => handleBookNow(service.id)}
                          className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105 text-xs py-1 h-8"
                        >
                          <CalendarLucide className="mr-2 h-3 w-3" />
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Server className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No services found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or browse all services
            </p>
            <Button
              onClick={handleReset}
              className="bg-[#502266] hover:bg-[#502266]/90"
            >
              Browse All Services
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredServices?.length > 0 && paginationData.lastPage > 1 && (
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
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={paginationData?.currentPage === 1}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Ellipsis for many pages */}
              {paginationData?.currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Pages around current page */}
              {Array.from(
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
