import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, Inbox } from "lucide-react"
import type { SupportTicket } from "@/types/support"

interface SupportStatsProps {
  tickets: SupportTicket[]
}

const stats = [
  {
    title: "Total Tickets",
    value: (tickets: SupportTicket[]) => tickets.length,
    icon: Inbox,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Open Tickets",
    value: (tickets: SupportTicket[]) => tickets.filter((ticket) => ticket.status === "open").length,
    icon: AlertCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "In Progress",
    value: (tickets: SupportTicket[]) => tickets.filter((ticket) => ticket.status === "in_progress").length,
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Resolved",
    value: (tickets: SupportTicket[]) => tickets.filter((ticket) => ticket.status === "resolved").length,
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
]

export function SupportStats({ tickets }: SupportStatsProps) {
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
                <p className="text-2xl font-bold">{stat.value(tickets)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

