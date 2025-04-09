import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      image: "/placeholder.svg",
    },
    action: "placed an order for",
    target: "Hair Styling",
    time: "2 minutes ago",
    type: "order",
  },
  {
    id: 2,
    user: {
      name: "Michael Brown",
      image: "/placeholder.svg",
    },
    action: "registered as a new",
    target: "vendor",
    time: "5 minutes ago",
    type: "registration",
  },
  {
    id: 3,
    user: {
      name: "Emily Davis",
      image: "/placeholder.svg",
    },
    action: "left a review for",
    target: "Nail Care Service",
    time: "10 minutes ago",
    type: "review",
  },
]

export function RecentActivity() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={activity.user.image} />
              <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

