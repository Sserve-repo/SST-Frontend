import { Plus, FileText, Tag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const actions = [
  {
    title: "Add Product",
    icon: Plus,
    description: "List a new product",
    href: "/vendor/dashboard/inventory",
    variant: "default" as const,
  },
  {
    title: "View Orders",
    icon: FileText,
    description: "Manage pending orders",
    href: "/vendor/dashboard/orders",
    variant: "outline" as const,
  },
  {
    title: "Create Promotion",
    icon: Tag,
    description: "Set up a new offer",
    href: "/vendor/dashboard/promotions",
    variant: "outline" as const,
  },
  {
    title: "Manage Shipping",
    icon: Truck,
    description: "Update shipping settings",
    href: "/vendor/dashboard/shipping",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {actions.map((action) => (
        <Card key={action.title}>
          <CardContent className="pt-6">
            <Button
              variant={action.variant}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href={action.href}>
                <action.icon className="h-4 w-4" />
                {action.title}
              </Link>
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              {action.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
