"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventById, type Event } from "@/actions/admin/event-api";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewEventDialogProps {
  eventId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ViewEventDialog({
  eventId,
  onOpenChange,
}: ViewEventDialogProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    if (!eventId) return;

    setLoading(true);
    try {
      const { data, error } = await getEventById(eventId);

      if (error) {
        throw new Error(error);
      }

      if (data) {
        setEvent(data);
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast({
        title: "Error",
        description: "Failed to load event details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Not specified";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={!!eventId} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : event ? (
          <div className="space-y-6">
            {/* Event Image */}
            {event.image ? (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={event.image || "/assets/images/image-placeholder.png"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}

            {/* Event Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <Badge variant="secondary">{event.event_type}</Badge>
                <Badge
                  variant={event.status === "active" ? "default" : "outline"}
                >
                  {event.status}
                </Badge>
              </div>
              {event.description && (
                <p className="text-muted-foreground">{event.description}</p>
              )}
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {formatDate(event.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{formatDate(event.end_date)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Start Time
                      </p>
                      <p className="font-medium">
                        {formatTime(event.start_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Time</p>
                      <p className="font-medium">
                        {formatTime(event.end_time)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium">
                      {event.location || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {event.address || "Not specified"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {event.capacity || "Unlimited"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maximum attendees
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Event Link
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {event.url ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(event.url, "_blank")}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Event Link
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No link provided
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Event Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Event Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(event.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Event not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
