import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Inbox, Star } from "lucide-react";

export function Sidebar() {
  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="text-2xl text-primary">My Inbox</span>
          </Link>
        </div>
        <div className="flex-1 px-4 py-2">
          <div className="space-y-2">
            <h2 className="px-2 text-lg font-semibold">My Messages</h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Inbox className="h-4 w-4" />
                Inbox
                <Badge className="ml-auto" variant="secondary">
                  1
                </Badge>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Star className="h-4 w-4" />
                Starred
                <Badge className="ml-auto" variant="secondary">
                  0
                </Badge>
              </Button>
            </div>
          </div>
          <div className="py-4">
            <h2 className="px-2 text-lg font-semibold tracking-tight">Label</h2>
            <div className="space-y-2 px-2 py-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="artisans" />
                <label htmlFor="artisans">Artisans</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="vendor" />
                <label htmlFor="vendor">Vendor</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
