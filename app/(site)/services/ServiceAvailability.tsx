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
import { getServiceByCategory } from "@/actions/service";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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

interface ScheduleRequest {
  date?: Date;
  time: string;
  serviceType: string | null;
  location: string | null;
}

// Updated to match the actual data structure from the API
const serviceTypes = [
  "Home Care",
  "Cleaning",
  "Maintenance",
  "Repair",
  "Installation",
];

const serviceLocations = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Ontario",
  "Quebec",
];

export default function ServiceAvailability() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState<ServiceProvider[]>(
    []
  );
  const [scheduleRequest, setScheduleRequest] = useState<ScheduleRequest>({
    date: undefined,
    time: "",
    serviceType: null,
    location: null,
  });

  const handleScheduleChange = (field: keyof ScheduleRequest, value: any) => {
    setScheduleRequest((prev) => ({ ...prev, [field]: value }));
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

  const convertTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  const handleSearch = () => {
    const filtered = services.filter((service) => {
      // Service type matching
      const matchesServiceType =
        !scheduleRequest.serviceType ||
        service.service_category_items_name?.toLowerCase() ===
          scheduleRequest.serviceType.toLowerCase();

      // Location matching
      const matchesLocation =
        !scheduleRequest.location ||
        service.province === scheduleRequest.location;

      // Time matching
      const matchesTime =
        !scheduleRequest.time ||
        (() => {
          const requestTime = convertTimeToMinutes(scheduleRequest.time);
          const startTime = convertTimeToMinutes(service.start_time);
          const endTime = convertTimeToMinutes(service.end_time);
          return requestTime >= startTime && requestTime <= endTime;
        })();

      // Date matching - You might want to implement this based on your business logic
      const matchesDate = !scheduleRequest.date || true;

      return (
        matchesServiceType && matchesLocation && matchesTime && matchesDate
      );
    });

    setFilteredServices(filtered);
  };

  // Trigger search when filters change
  useEffect(() => {
    if (services.length > 0) {
      handleSearch();
    }
  }, [scheduleRequest]);

  // Initial data fetch
  useEffect(() => {
    if (categoryId) {
      handleFetchService(parseInt(categoryId));
    }
  }, [categoryId]);

  const handleHireNow = (serviceId: string) => {
    router.push(`/booking/?serviceId=${serviceId}`);
  };

  return (
    <div className="container flex justify-center items-center flex-col mx-auto p-4 max-w-7xl py-28 md:py-32">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold my-4 text-primary">
          Check Service Availability
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
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

          <Card className="w-[220px]">
            <CardContent className="p-2">
              <Select
                value={scheduleRequest.serviceType || ""}
                onValueChange={(value) =>
                  handleScheduleChange("serviceType", value)
                }
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select Service" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

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
                  {serviceLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="w-[220px]">
            <CardContent className="p-2 flex items-end">
              <Button className="w-full" onClick={handleSearch}>
                Check Availability
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
        ) : filteredServices.length > 0 ? (
          filteredServices.map((provider) => (
            <Card key={provider.id} className="overflow-hidden bg-gray-50">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-grow">
                  <div className="flex items-center space-x-4 mb-4">
                    <Image
                      src={provider.image}
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
          <div className="text-center mt-8 text-gray-600">
            <p>No service providers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
