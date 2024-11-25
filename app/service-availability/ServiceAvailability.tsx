"use client";

import { useState } from "react";
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
  name: string;
  serviceType: ServiceType;
  pricePerHour: number;
  duration: number;
  location: string;
  rating: number;
  description: string;
  imageUrl: string;
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

const mockServiceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "John Doe",
    serviceType: "plumbing",
    pricePerHour: 50,
    duration: 2,
    location: "New York",
    rating: 4.5,
    description:
      "Experienced plumber specializing in residential and commercial plumbing services.",
    imageUrl: "/image-url.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    serviceType: "electrical",
    pricePerHour: 60,
    duration: 3,
    location: "Los Angeles",
    rating: 4.8,
    description:
      "Licensed electrician with expertise in wiring, installations, and repairs.",
    imageUrl: "/image-url.jpg",
  },
  {
    id: "3",
    name: "Bob Johnson",
    serviceType: "carpentry",
    pricePerHour: 55,
    duration: 4,
    location: "Chicago",
    rating: 4.2,
    description:
      "Skilled carpenter offering custom woodworking and furniture repair services.",
    imageUrl: "/image-url.jpg",
  },
  {
    id: "4",
    name: "Alice Brown",
    serviceType: "painting",
    pricePerHour: 45,
    duration: 5,
    location: "Houston",
    rating: 4.7,
    description:
      "Professional painter specializing in interior and exterior painting for homes and businesses.",
    imageUrl: "/image-url.jpg",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    serviceType: "general",
    pricePerHour: 40,
    duration: 2,
    location: "Phoenix",
    rating: 4.0,
    description:
      "Versatile handyman capable of handling various home repair and maintenance tasks.",
    imageUrl: "/image-url.jpg",
  },
];

export default function ServiceAvailability() {
  const [scheduleRequest, setScheduleRequest] = useState<ScheduleRequest>({
    date: undefined,
    time: "",
    serviceType: null,
    location: null,
  });

  const filteredProviders = mockServiceProviders.filter(
    (provider) =>
      (!scheduleRequest.serviceType ||
        provider.serviceType === scheduleRequest.serviceType) &&
      (!scheduleRequest.location ||
        provider.location === scheduleRequest.location)
  );

  const handleScheduleChange = (field: keyof ScheduleRequest, value: any) => {
    setScheduleRequest((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Searching with:", scheduleRequest);
  };

  return (
    <div className="container flex justify-center items-center flex-col mx-auto p-4 max-w-7xl py-28 md:py-32">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold my-4 text-primary">Check Service Availability</h2>
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
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="overflow-hidden bg-gray-50">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex-grow">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={provider.imageUrl}
                    alt={`${provider.name}'s profile picture`}
                    width={100}
                    height={100}
                    className="rounded-md bg-gray-300"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{provider.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {provider.serviceType}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="ml-1">{provider.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {provider.description}
                </p>
                <div className="flex items-center text-green-600">
                  {/* <DollarSign className="w-5 h-5 mr-1" /> */}
                  <span className="font-semibold text-lg">
                    ${provider.pricePerHour}/hour
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 flex flex-col justify-between">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Duration: {provider.duration} hrs
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {provider.location}
                  </span>
                </div>
                <Button className="mt-auto">Book Now</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center mt-8 text-gray-600">
          <p>No service providers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
