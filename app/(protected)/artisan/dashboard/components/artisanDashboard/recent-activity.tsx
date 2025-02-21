import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    service: "Haircut & Styling",
    rating: 5,
    comment: "Amazing service! Very professional and friendly.",
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Michael Brown",
    avatar: "/placeholder.svg",
    service: "Hair Coloring",
    rating: 4,
    comment: "Great results, but had to wait a bit longer than expected.",
    time: "1 day ago",
  },
]

const messages = [
  {
    id: 1,
    name: "Emily Davis",
    avatar: "/placeholder.svg",
    message: "Hi, I'd like to book an appointment for next week.",
    time: "30 mins ago",
    unread: true,
  },
  {
    id: 2,
    name: "James Wilson",
    avatar: "/placeholder.svg",
    message: "Thanks for the great service yesterday!",
    time: "2 hours ago",
    unread: false,
  },
]

export function RecentActivity() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-gray-100">
        <CardHeader>
          <CardTitle>Latest Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>{review.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-500">{review.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100">
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>{message.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{message.name}</p>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{message.message}</p>
                </div>
                {message.unread && <span className="h-2 w-2 rounded-full bg-blue-500" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecentActivity