import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Metadata } from "next";
import { Layout } from "./components/layout";
import { MessagesList } from "./components/messages-list";

export const metadata: Metadata = {
  title: "Inbox Message | SphereServe",
};

const messages = [
  {
    id: "1",
    sender: "Jullu Jalal",
    subject: "Our Bachelor of Commerce program is ACBSP-accredited",
    label: "Artisan",
    timestamp: "8:38 AM",
    starred: false,
    content: "",
  },
  // Add more sample messages here
];

export default function InboxPage() {
  return (
    <div className="px-4 py-8">
    <Layout>
      <div className="flex flex-col h-full">
        <div className="border-b p-2 h-[60px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input className="pl-9 rounded-full" placeholder="Search..." />
          </div>
        </div>
        <MessagesList messages={messages} />
      </div>
    </Layout>
    </div>
  );
}
