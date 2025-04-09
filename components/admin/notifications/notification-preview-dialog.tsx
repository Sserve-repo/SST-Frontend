"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Send } from "lucide-react"
import type { Notification } from "@/types/notifications"

interface NotificationPreviewDialogProps {
  notification: Notification | null
  onOpenChange: (open: boolean) => void
}

export function NotificationPreviewDialog({ notification, onOpenChange }: NotificationPreviewDialogProps) {
  if (!notification) return null

  return (
    <Dialog open={!!notification} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{notification.title}</h2>
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
            </div>
          </div>

          <div className="rounded-lg border bg-muted/40 p-6">
            <p className="whitespace-pre-wrap">{notification.message}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Send className="h-4 w-4" />
              <span>
                {notification.sentAt
                  ? `Sent on ${new Date(notification.sentAt).toLocaleString()}`
                  : notification.scheduledFor
                    ? `Scheduled for ${new Date(notification.scheduledFor).toLocaleString()}`
                    : "Draft"}
              </span>
            </div>
            <Badge variant="outline">{notification.status}</Badge>
          </div>

          {notification.stats && (
            <div className="grid grid-cols-3 gap-4 rounded-lg border bg-muted/40 p-4">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

