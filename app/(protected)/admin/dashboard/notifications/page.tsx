"use client"

import { useState } from "react"
import { NotificationList } from "@/components/admin/notifications/notification-list"
import { CreateNotificationDialog } from "@/components/admin/notifications/create-notification-dialog"
import { NotificationStats } from "@/components/admin/notifications/notification-stats"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import type { Notification } from "@/types/notifications/notifications"

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Feature Release",
      message:
        "We're excited to announce our new booking system is now live! Check it out and let us know what you think.",
      targetAudience: ["all"],
      status: "sent",
      scheduledFor: null,
      sentAt: "2024-02-25T10:00:00",
      createdAt: "2024-02-24T15:30:00",
      stats: {
        sent: 1250,
        delivered: 1200,
        read: 800,
      },
    },
    {
      id: "2",
      title: "Holiday Schedule",
      message: "Please note our updated holiday operating hours. Make sure to adjust your availability accordingly.",
      targetAudience: ["vendor", "artisan"],
      status: "scheduled",
      scheduledFor: "2024-03-01T09:00:00",
      sentAt: null,
      createdAt: "2024-02-25T11:00:00",
      stats: null,
    },
    {
      id: "3",
      title: "Special Promotion",
      message: "Don't miss out on our upcoming spring promotion! Great discounts on all services.",
      targetAudience: ["shopper"],
      status: "draft",
      scheduledFor: null,
      sentAt: null,
      createdAt: "2024-02-25T14:30:00",
      stats: null,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Notifications</h1>
          <p className="text-muted-foreground">Manage and send notifications to your users</p>
        </div>
        <CreateNotificationDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Notification
          </Button>
        </CreateNotificationDialog>
      </div>

      <NotificationStats notifications={notifications} />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <NotificationList notifications={notifications} />
        </TabsContent>

        <TabsContent value="sent">
          <NotificationList notifications={notifications.filter((n) => n.status === "sent")} />
        </TabsContent>

        <TabsContent value="scheduled">
          <NotificationList notifications={notifications.filter((n) => n.status === "scheduled")} />
        </TabsContent>

        <TabsContent value="draft">
          <NotificationList notifications={notifications.filter((n) => n.status === "draft")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

