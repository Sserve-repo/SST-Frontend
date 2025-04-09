import { Card, CardContent } from "@/components/ui/card"
import { Bell, Clock, Send, Users } from "lucide-react"
import type { Notification } from "@/types/notifications/notifications"

interface NotificationStatsProps {
  notifications: Notification[]
}

const stats = [
  {
    title: "Total Sent",
    value: (notifications: Notification[]) => notifications.filter((n) => n.status === "sent").length,
    icon: Send,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Scheduled",
    value: (notifications: Notification[]) => notifications.filter((n) => n.status === "scheduled").length,
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Draft",
    value: (notifications: Notification[]) => notifications.filter((n) => n.status === "draft").length,
    icon: Bell,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Total Recipients",
    value: (notifications: Notification[]) => {
      const sentNotifications = notifications.filter((n) => n.stats)
      return sentNotifications.reduce((acc, n) => acc + (n.stats?.sent || 0), 0)
    },
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

export function NotificationStats({ notifications }: NotificationStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value(notifications)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

