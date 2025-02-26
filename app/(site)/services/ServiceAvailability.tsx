"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Star,
  MapPin,
  Clock,
  CalendarIcon,
  Clock10,
  Server,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { getServiceByCategory, getServicesMenu } from "@/actions/service";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { baseUrl } from "@/config/constant";

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

interface ScheduleRequest {
  date?: Date;
  time: string;
  serviceCategory: string | null;
  serviceType: string | null;
  location: string | null;
}

// const serviceLocations = [
//   "Alberta",
//   "British Columbia",
//   "Manitoba",
//   "New Brunswick",
//   "Ontario",
//   "Quebec",
// ];

export default function ServiceAvailability() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const categoryName = searchParams.get("categoryName");

  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  // const [serviceItems, setServiceItems] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState<ServiceProvider[]>(
    []
  );

  const [scheduleRequest, setScheduleRequest] = useState<ScheduleRequest>({
    date: undefined,
    time: "",
    serviceCategory: categoryName || null,
    serviceType: null,
    location: null,
  });

  const [provinces, setProvinces] = useState<
    Array<{ id: number; name: string }>
  >([]);

  // Fetch service categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getServicesMenu();
        if (response && response.ok) {
          const data = await response.json();
          const categories = data.data["Service Category Menu"];
          setCategories(categories);

          // If we have a categoryId, set the service items
          if (categoryId) {
            const category = categories.find(
              (cat) => cat.id === parseInt(categoryId)
            );
            if (category) {
              // setServiceItems(category.service_category_items);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
      }
    };
    fetchCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/general/province/getProvince`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.data.Provinces)
          setProvinces(data.data.Provinces);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleScheduleChange = (field: keyof ScheduleRequest, value: any) => {
    setScheduleRequest((prev) => {
      const newRequest = { ...prev, [field]: value };

      // If changing service category, update URL and reset service type
      if (field === "serviceCategory") {
        const category = categories.find((cat) => cat.name === value);
        if (category) {
          router.push(
            `/services?categoryId=${
              category.id
            }&categoryName=${encodeURIComponent(value)}`
          );
          // setServiceItems(category.service_category_items);
          return { ...newRequest, serviceType: null };
        }
      }

      return newRequest;
    });
  };

  const handleFetchService = async (catId: number) => {
    setIsLoading(true);
    try {
      const response = await getServiceByCategory(catId);
      if (response && response.ok) {
        const data = await response.json();
        setServices(data.data["Services"]);
        setFilteredServices(data.data["Services"]);
      } else {
        setServices([]);
        setFilteredServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchAllServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/general/services/getAllServices`
      );
      if (response.ok) {
        const data = await response.json();
        setServices(data.data["Services"]);
        setFilteredServices(data.data["Services"]);
      } else {
        setServices([]);
        setFilteredServices([]);
      }
    } catch (error) {
      console.error("Error fetching all services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  const handleSearch = () => {
    if (!services) return;

    const filtered = services.filter((service) => {
      // Service category matching
      const categoryMatches =
        !scheduleRequest.serviceCategory ||
        service.service_category_name.toLowerCase() ===
          scheduleRequest.serviceCategory.toLowerCase();

      // Location matching
      const locationMatches =
        !scheduleRequest.location ||
        service.province.toLowerCase() ===
          scheduleRequest.location.toLowerCase();

      // Time matching (only if time is selected)
      const timeMatches =
        !scheduleRequest.time ||
        (() => {
          const requestTime = convertTimeToMinutes(scheduleRequest.time);
          const startTime = convertTimeToMinutes(service.start_time);
          const endTime = convertTimeToMinutes(service.end_time);
          return requestTime >= startTime && requestTime <= endTime;
        })();

      // Date matching (if implemented in the backend)
      const dateMatches = !scheduleRequest.date || true; // Placeholder for date filtering

      return categoryMatches && locationMatches && timeMatches && dateMatches;
    });

    setFilteredServices(filtered);
  };

  // Trigger search when filters change
  useEffect(() => {
    if (services?.length > 0) {
      handleSearch();
    }
  }, [scheduleRequest, services]); // Add services to dependency array

  // Initial data fetch when categoryId changes
  useEffect(() => {
    if (categoryId) {
      handleFetchService(parseInt(categoryId));
    } else {
      handleFetchAllServices();
    }
  }, [categoryId]);

  const handleHireNow = (serviceId: string) => {
    router.push(`/booking/?serviceId=${serviceId}`);
  };

  return (
    <div className="container flex justify-start items-center flex-col min-h-screen mx-auto p-4 max-w-7xl py-28 md:py-32">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold my-4 text-primary">
          Check Service Availability
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Date Selector */}
          <Card className="w-[220px]">
            <CardContent className="p-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left text-sm font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleRequest.date ? (
                      format(scheduleRequest.date, "PP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduleRequest.date}
                    onSelect={(date) => handleScheduleChange("date", date)}
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Time Selector */}
          <Card className="w-[220px]">
            <CardContent className="p-2">
              <Select
                value={scheduleRequest.time}
                onValueChange={(value) => handleScheduleChange("time", value)}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Clock10 className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select time" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                    <SelectItem key={hour} value={`${hour}:00`}>
                      {`${hour}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Service Category Selector */}
          <Card className="w-[280px]">
            <CardContent className="p-2">
              <Select
                value={scheduleRequest.serviceCategory || ""}
                onValueChange={(value) =>
                  handleScheduleChange("serviceCategory", value)
                }
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Service Type Selector */}
          {/* <Card className="w-[220px]">
            <CardContent className="p-2">
              <Select
                value={scheduleRequest.serviceType || ""}
                onValueChange={(value) =>
                  handleScheduleChange("serviceType", value)
                }
                disabled={!scheduleRequest.serviceCategory}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select Service Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {serviceItems.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card> */}

          {/* Location Selector */}
          <Card className="w-[220px]">
            <CardContent className="p-2">
              <Select
                value={scheduleRequest.location || ""}
                onValueChange={(value) =>
                  handleScheduleChange("location", value)
                }
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.name}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Search Button */}
          <Card className="w-[220px]">
            <CardContent className="p-2 flex items-end">
              <Button className="w-full" onClick={handleSearch}>
                Check Availability
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service List */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-6xl">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              className="overflow-hidden bg-gray-50"
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
            <Card key={provider.id} className="overflow-hidden bg-gray-50">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-grow">
                  <div className="flex items-center space-x-4 mb-4">
                    <Image
                      src={provider.image || "/assets/images/image-placeholder.png"}
                      alt={`${provider.title}'s profile picture`}
                      width={100}
                      height={100}
                      className="rounded-md bg-gray-300"
                    />
                    <div>
                      <h3 className="text-[2rem] text-[#502266] font-semibold">
                        {provider.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {provider.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-[#FFDFC0]">
                          {provider.service_category_items_name}
                        </Badge>
                        <Badge variant="secondary" className="bg-[#FFDFC0]">
                          {provider.service_category_name}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row gap-x-4 items-center justify-start">
                    <div className="flex items-center text-[#502266]">
                      <span className="font-semibold text-lg">
                        ${provider.price}
                      </span>
                    </div>
                    {provider.rating && (
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="ml-1">
                          {provider.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 flex flex-col justify-between">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      Duration: {provider.service_duration} hrs
                    </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {provider.city}, {provider.province}
                    </span>
                  </div>
                  <Button
                    className="mt-auto text-white"
                    onClick={() => handleHireNow(provider.id)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center mt-24 text-gray-600">
            <p>No service providers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
