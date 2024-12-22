import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const products = Array(10).fill({
  title: "Building Solutions Co.",
  rating: "4.7/5.0",
  image: "/placeholder.svg",
});

export function ProductGallery() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Similar to your Searches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium">{product.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {product.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
