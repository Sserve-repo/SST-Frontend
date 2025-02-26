import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const products = [
  {
    category: "Leather Boots",
    image: "/assets/images/image-placeholder.png",
    price: "$40.00",
    supplier: "Reliable Supplier Inc",
  },
  {
    category: "Dinner Gowns",
    image: "/assets/images/image-placeholder.png",
    price: "$45.00",
    supplier: "Reliable Supplier Inc",
  },
  {
    category: "Leather Wallet",
    image: "/assets/images/image-placeholder.png",
    price: "$40.00",
    supplier: "Reliable Supplier Inc",
  },
];

export function TrendingProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.category}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid gap-1">
                <h3 className="font-medium">{product.category}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.supplier}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{product.price}</span>
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
