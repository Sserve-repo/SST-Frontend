"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditNotificationDialog } from "./edit-notification-dialog"
import { DeleteNotificationDialog } from "./delete-notification-dialog"
import { NotificationPreviewDialog } from "./notification-preview-dialog"
import { Clock, Eye, MoreHorizontal, Pencil, Send, Trash2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/notifications/notifications"

interface NotificationListProps {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  const [notificationToEdit, setNotificationToEdit] = useState<Notification | null>(null)
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null)
  const [notificationToPreview, setNotificationToPreview] = useState<Notification | null>(null)

  return (
    <>
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        notification.status === "sent" && "bg-green-100 text-green-600",
                        notification.status === "scheduled" && "bg-blue-100 text-blue-600",
                        notification.status === "draft" && "bg-yellow-100 text-yellow-600",
                      )}
                    >
                      {notification.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {notification.targetAudience.includes("all")
                          ? "All Users"
                          : notification.targetAudience
                              .map((audience) => audience.charAt(0).toUpperCase() + audience.slice(1))
                              .join(", ")}
                      </span>
                    </div>
                    {notification.scheduledFor && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(notification.scheduledFor).toLocaleString()}</span>
                      </div>
                    )}
                    {notification.sentAt && (
                      <div className="flex items-center gap-1">
                        <Send className="h-4 w-4" />
                        <span>{new Date(notification.sentAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setNotificationToPreview(notification)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {notification.status !== "sent" && (
                        <DropdownMenuItem onClick={() => setNotificationToEdit(notification)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {notification.status === "draft" && (
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send Now
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setNotificationToDelete(notification)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {notification.stats && (
                <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg border bg-muted/40 p-4">
                  <div>
                    <p className="text-sm font-medium">Sent</p>
                    <p className="mt-1 text-2xl font-bold">{notification.stats.sent}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Delivered</p>
                    <p className="mt-1 text-2xl font-bold">{notification.stats.delivered}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Read</p>
                    <p className="mt-1 text-2xl font-bold">{notification.stats.read}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {notifications.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="font-semibold">No notifications found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new notification.</p>
          </div>
        )}
      </div>

      <EditNotificationDialog
        notification={notificationToEdit}
        onOpenChange={(open) => !open && setNotificationToEdit(null)}
      />

      <DeleteNotificationDialog
        notification={notificationToDelete}
        onOpenChange={(open) => !open && setNotificationToDelete(null)}
      />

      <NotificationPreviewDialog
        notification={notificationToPreview}
        onOpenChange={(open) => !open && setNotificationToPreview(null)}
      />
    </>
  )
}

