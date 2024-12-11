"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Star,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
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

type ServiceType =
  | "plumbing"
  | "electrical"
  | "carpentry"
  | "painting"
  | "general";

interface ScheduleRequest {
  date?: Date;
  time: string;
  serviceType: ServiceType | null;
  location: string | null;
}

interface ServiceProvider {
  id: string;
  user_id: string;
  title: string;
  price: number;
  start_time: string;
  end_time: string;
  location: string;
  rating: number;
  province: string;
  description: string;
  image: string;
  service_category_items_name?: string;
  service_category_name?: string;
}

const serviceTypes: ServiceType[] = [
  "plumbing",
  "electrical",
  "carpentry",
  "painting",
  "general",
];

const serviceLocations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

export default function ServiceAvailability() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [scheduleRequest, setScheduleRequest] = useState<ScheduleRequest>({
    date: undefined,
    time: "",
    serviceType: null,
    location: null,
  });

  // const filteredProviders = mockServiceProviders.filter(
  //   (provider) =>
  //     (!scheduleRequest.serviceType ||
  //       provider.serviceType === scheduleRequest.serviceType) &&
  //     (!scheduleRequest.location ||
  //       provider.location === scheduleRequest.location)
  // );

  const handleScheduleChange = (field: keyof ScheduleRequest, value: any) => {
    setScheduleRequest((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Searching with:", scheduleRequest);
  };

  const handleFetchService = async (catId: number) => {
    const response = await getServiceByCategory(catId);
    if (response && response.ok) {
      const data = await response.json();
      setServices(data.data["Services"]);
    } else {
      setServices([]);
    }
  };

  useEffect(() => {
    if (categoryId) {
      handleFetchService(parseInt(categoryId));
    }
  }, [categoryId]);

  const handleHireNow = async (serviceId) => {
    router.push(`/booking/?serviceId=${serviceId}`);
  };

  return (
    <div className="container flex justify-center items-center flex-col mx-auto p-4 max-w-7xl py-28 md:py-32">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold my-4 text-primary">
          Check Service Availability
        </h2>
        <div className="flex flex-wrap gap-4">
          <Card className="w-[220px]">
            <CardContent className="p-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left text-sm font-normal"
                    id="date"
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
                    // initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card className="w-[220px]">
            <CardContent className="p-2">
              <Select
                onValueChange={(value) => handleScheduleChange("time", value)}
              >
                <SelectTrigger id="time">
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
                onValueChange={(value) =>
                  handleScheduleChange("serviceType", value as ServiceType)
                }
              >
                <SelectTrigger id="service-type" className="">
                  <div className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select Service" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="w-[220px]">
            <CardContent className="p-2">
              <Select
                onValueChange={(value) =>
                  handleScheduleChange("location", value)
                }
              >
                <SelectTrigger id="location" className="">
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
        {services.map((provider) => (
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
                    <div className="flex ">
                      <Badge variant="secondary" className="bg-[#FFDFC0]">
                        {" "}
                        {provider?.service_category_items_name}
                      </Badge>
                      <Badge variant="secondary" className="bg-[#FFDFC0]">
                        {" "}
                        {provider?.service_category_name}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-x-4 items-center justify-start ">
                  <div className="flex items-center text-[#502266]">
                    <span className="font-semibold text-lg">
                      ${provider.price}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="ml-1">{provider?.rating?.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 flex flex-col justify-between">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Duration: {`${provider.start_time} -- ${provider.end_time}`}{" "}
                    hrs
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {provider.province}
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
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center mt-8 text-gray-600">
          <p>No service providers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
