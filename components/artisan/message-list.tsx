import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const messages = [
  {
    id: 1,
    sender: "Abby Esther",
    message: "I would get back to you...",
    time: "5:25pm",
    avatar: "/assets/images/image-placeholder.png",
    online: true,
  },
  {
    id: 2,
    sender: "Abby Esther",
    message: "I would get back to you...",
    time: "5:25pm",
    avatar: "/assets/images/image-placeholder.png",
    online: true,
  },
  {
    id: 3,
    sender: "Abby Esther",
    message: "I would get back to you...",
    time: "4:00pm",
    avatar: "/assets/images/image-placeholder.png",
    online: true,
  },
  {
    id: 4,
    sender: "Abby Esther",
    message: "I would get back to you...",
    time: "3:54pm",
    avatar: "/assets/images/image-placeholder.png",
    online: true,
  },
  {
    id: 5,
    sender: "Abby Esther",
    message: "I would get back to you...",
    time: "1:23pm",
    avatar: "/assets/images/image-placeholder.png",
    online: true,
  },
]

export function MessageList() {
  return (
    <Card className="border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <div className="relative w-full max-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9 rounded-full border-gray-200" placeholder="Search" />
          </div>
        </div>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={message.avatar} alt={message.sender} />
                  <AvatarFallback>{message.sender[0]}</AvatarFallback>
                </Avatar>
                {message.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{message.sender}</p>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default MessageList