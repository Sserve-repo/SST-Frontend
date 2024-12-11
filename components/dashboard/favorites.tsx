import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const favorites = [
  {
    category: "Leather Boots",
    image: "/placeholder.svg",
    price: "$50.00",
  },
  {
    category: "Leather Boots",
    image: "/placeholder.svg",
    price: "$50.00",
  },
];

export function Favorites() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {favorites.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.category}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid gap-1">
                <h3 className="font-medium">{item.category}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.price}</span>
                  <Button size="sm">Buy Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
