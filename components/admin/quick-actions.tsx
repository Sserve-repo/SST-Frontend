import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, CheckSquare } from "lucide-react"

const actions = [
  {
    title: "Create Notification",
    description: "Send updates to users",
    icon: Bell,
    color: "text-primary",
    bgColor: "bg-[#5D3A8B]/10",
  },
  {
    title: "Add Event",
    description: "Schedule new events",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Approve Products",
    description: "Review pending items",
    icon: CheckSquare,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto flex items-center justify-start gap-4 p-4 hover:bg-muted"
            >
              <div className={`rounded-lg p-2 ${action.bgColor}`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">{action.title}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

