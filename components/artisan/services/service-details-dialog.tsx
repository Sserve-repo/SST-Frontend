"use client";

import { format } from "date-fns";
import {
  Clock,
  DollarSign,
  Star,
  Calendar,
  MapPin,
  Tag,
  ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
<<<<<<< HEAD
=======
// import { ScrollArea } from "@/components/ui/scroll-area";
>>>>>>> origin/lastest-update
import type { Service } from "@/types/services";
import Image from "next/image";

interface ServiceDetailsDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceDetailsDialog({
  service,
  open,
  onOpenChange,
}: ServiceDetailsDialogProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        color: "bg-emerald-100 text-emerald-700",
        label: "Active",
      },
      inactive: {
        color: "bg-gray-200 text-gray-800",
        label: "Inactive",
      },
      draft: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Draft",
      },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;
    return (
      <Badge className={`rounded-full px-3 py-1 text-sm ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px]  max-h-[85vh] rounded-2xl border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold">Service Details</span>
            {getStatusBadge(service.status)}
          </DialogTitle>
        </DialogHeader>

        {/* <ScrollArea className="max-h-[65vh] overflow-y-scroll pr-2"> */}
          <div className="space-y-6 py-2">
            {/* Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-24 w-24 rounded-xl ring-2 ring-muted">
                <AvatarImage
                  src={
                    service.images[0] || "/assets/images/image-placeholder.png"
                  }
                />
                <AvatarFallback className="text-xl rounded-xl bg-muted text-muted-foreground">
                  {service.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {service.name}
                </h2>
                <p className="text-gray-500 mt-1 line-clamp-3">
                  {service.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <strong className="text-foreground">
                      ${service.price}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.duration} minutes
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    {service.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center gap-1 mb-1">
                    {renderStars(Math.round(service.rating))}
                  </div>
                  <p className="text-2xl font-bold text-yellow-500">
                    {service.rating.toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{service.reviewCount}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{service.bookingCount}</p>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                </CardContent>
              </Card>
            </div>

            {/* Info Panels */}
            <div className="flex sm:grid-flow-row flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{service.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{service.duration} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(service.status)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {format(service.createdAt, "PPpp")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-muted-foreground">Updated</p>
                      <p className="font-medium">
                        {format(service.updatedAt, "PPpp")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {service.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Full Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Images */}
            {service.images?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="h-5 w-5" />
                    Service Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {service.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-square overflow-hidden rounded-xl shadow-sm hover:scale-105 transition"
                      >
                        <Image
                          src={img || "/assets/images/image-placeholder.png"}
                          alt={`Image ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Availability */}
            {service.availability?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {service.availability.map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-muted/50 p-2 rounded-md"
                    >
                      <span className="font-medium">
                        {
                          [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ][slot.dayOfWeek]
                        }
                      </span>
                      <span className="text-muted-foreground">
                        {slot.isAvailable
                          ? `${slot.startTime} - ${slot.endTime}`
                          : "Unavailable"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  );
}
