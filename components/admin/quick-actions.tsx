import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, CheckSquare } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Create User",
    description: "create new users",
    icon: Bell,
    color: "text-primary",
    bgColor: "bg-[#5D3A8B]/10",
    href: "/admin/dashboard/users",
  },
  {
    title: "Add Event",
    description: "Schedule new events",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    href: "/admin/dashboard/events",
  },
  {
    title: "View Payouts",
    description: "manage vendor's & artisan's payout",
    icon: CheckSquare,
    color: "text-green-600",
    bgColor: "bg-green-100",
    href: "/admin/dashboard/payouts",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {actions.map((action) => (
            <Link
              href={action.href}
              key={action.title}
              className="h-auto flex items-center justify-start gap-4 p-4 hover:bg-muted border rounded-lg border-1"
            >
              {/* <Link href={action.href}> */}
              <div className={`rounded-lg p-2 ${action.bgColor}`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">{action.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
              {/* </Link> */}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
