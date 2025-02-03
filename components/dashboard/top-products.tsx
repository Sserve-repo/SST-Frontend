"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface TopProduct {
  name: string;
  orders: number;
  image: string;
}

const topProducts: TopProduct[] = Array(5).fill({
  name: "Kitchen Plumbing",
  orders: 600,
  image: "/placeholder.svg",
});

export function TopProducts() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          Top Ordered Product
        </CardTitle>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {topProducts.map((product, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-medium">{product.name}</span>
            </div>
            <span className="text-muted-foreground">
              {product.orders} Orders
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
