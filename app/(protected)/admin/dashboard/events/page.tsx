"use client";

import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Filter,
  Download,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getEvents, type Event } from "@/actions/admin/event-api";
// import { useToast } from "@/hooks/use-toast";
import { CreateEventDialog } from "@/components/admin/events/create-event-dialog";
import { EditEventDialog } from "@/components/admin/events/edit-event-dialog";
import { ViewEventDialog } from "@/components/admin/events/view-event-dialog";
import { DeleteEventDialog } from "@/components/admin/events/delete-event-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

interface EventTableItem {
  id: string;
  title: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  capacity: string;
  image: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventTableItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventTableItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [viewingEventId, setViewingEventId] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<{
    id: string;
    title: string;
  } | null>(null);
  // const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getEvents();

      if (apiError) {
        throw new Error(apiError);
      }

      if (data) {
        setStats({
          total: data.total_events,
          upcoming: data.upcoming_events,
          completed: data.completed_events,
        });

        const formattedEvents = data.events.map((event: Event) => ({
          id: event.id.toString(),
          title: event.title,
          type: event.event_type,
          location: event.location,
          startDate: new Date(event.start_date).toLocaleDateString(),
          endDate: new Date(event.end_date).toLocaleDateString(),
          status: event.status,
          capacity: event.capacity,
          image: event.image,
        }));
        setEvents(formattedEvents);
        setFilteredEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  const handleDeleteEvent = (event: EventTableItem) => {
    setDeletingEvent({ id: event.id, title: event.title });
  };

  const handleEditEvent = (eventId: string) => {
    setEditingEventId(eventId);
  };

  const handleViewEvent = (eventId: string) => {
    setViewingEventId(eventId);
  };

  const columns: ColumnDef<EventTableItem>[] = [
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => {
        const image = row.getValue("image") as string;
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
            {image ? (
              <img
                src={image || "/placeholder.svg"}
                alt={row.getValue("title") as string}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return <div className="font-medium">{title}</div>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const location = row.getValue("location") as string;
        return location || "Not specified";
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => {
        const capacity = row.getValue("capacity") as string;
        return capacity || "Unlimited";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "default" | "secondary" | "outline" = "default";

        if (status === "upcoming") variant = "secondary";
        if (status === "completed") variant = "outline";

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewEvent(event.id)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditEvent(event.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Event
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteEvent(event)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchEvents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Event Management</h1>
          <p className="text-muted-foreground">Create and manage your events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <CreateEventDialog onSuccess={fetchEvents}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </CreateEventDialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-1 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All events</p>
          </CardContent>
        </Card>

        <Card className="border-l-1 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.upcoming}
            </div>
            <p className="text-xs text-muted-foreground">Scheduled events</p>
          </CardContent>
        </Card>

        <Card className="border-l-1 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Events
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Finished events</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Events Table */}
      <Card>
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={filteredEvents}
            searchKey="title"
            searchPlaceholder="Search events..."
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditEventDialog
        event={editingEventId}
        eventId={editingEventId}
        onOpenChange={(open) => !open && setEditingEventId(null)}
        onSuccess={fetchEvents}
      />

      <ViewEventDialog
        eventId={viewingEventId}
        onOpenChange={(open) => !open && setViewingEventId(null)}
      />

      <DeleteEventDialog
        event={deletingEvent}
        eventId={deletingEvent?.id || null}
        eventTitle={deletingEvent?.title || ""}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
