"use client";

import { useState } from "react";
import { Heart, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample data
const services = [
  {
    id: 1,
    title: "AgboCity Design Studio",
    image:
      "! ",
    status: "AVAILABLE",
    rating: 4.9,
    reviews: 19,
    price: 65,
    isNew: true,
  },
  {
    id: 2,
    title: "AgboCity Mechanics",
    image:
      "! ",
    status: "NEW",
    rating: 4.9,
    reviews: 15,
    price: 65,
    isNew: true,
  },
  {
    id: 3,
    title: "Food By Ella",
    image:
      "! ",
    status: "NEW",
    rating: 4.9,
    reviews: 12,
    price: 65,
    isNew: true,
  },
  // Add more services as needed
];

const products = [
  {
    id: 1,
    title: "Hair Clips",
    image:
      "! ",
    price: 96.0,
    gallery: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
  },
  {
    id: 2,
    title: "Lip gloss",
    image:
      "! ",
    price: 96.0,
    gallery: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
  },
  {
    id: 3,
    title: "Leather Wristwatch",
    image:
      "! ",
    price: 96.0,
    gallery: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
  },
  // Add more products as needed
];

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900">
          Favorites List
        </h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Items
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Input
          type="text"
          placeholder="I am looking for..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12"
        />
        <Button className="absolute right-0 top-0 bottom-0 rounded-l-none bg-purple-900 hover:bg-purple-800">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {/* Favourite Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-purple-900 mb-6">
          Favourite Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="bg-purple-900 text-white overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover bg-slate-50"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white hover:text-purple-200"
                    onClick={() => toggleFavorite(service.id)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(service.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={service.isNew ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-300">⭐</span>
                    <span className="text-sm">{service.rating}</span>
                    <span className="text-sm text-gray-300">
                      ({service.reviews})
                    </span>
                  </div>
                  <p className="text-sm mb-4">From ${service.price}</p>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-purple-900 hover:bg-gray-100"
                  >
                    Book now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Favourite Products */}
      <section>
        <h2 className="text-2xl font-bold text-purple-900 mb-6">
          Favourite Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover bg-slate-50"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white hover:text-purple-200"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(product.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex gap-2 mb-4">
                    {product.gallery.map((_, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded bg-gray-200"
                      />
                    ))}
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
