"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { useCart } from "@/context/CartContext";

// API Base URL Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.sserves.com/api/v1";

type Product = {
  id: number;
  title: string;
  price: string | number;
  image?: string;
  category?: { name?: string };
  category_title?: string;
  is_favorite?: boolean;
  stock_level?: number;
};

export default function FeaturedProducts() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    try {
      let response;
      if (isAuthenticated) {
        response = await fetch(`${API_BASE_URL}/general/featuredProducts`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });
      } else {
        response = await fetch(`${API_BASE_URL}/general/featuredProducts`);
      }
      const data = await response.json();

      if (data.status && data.data.highlighted_products) {
        setProducts(data.data.highlighted_products);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    await addToCart({
      product_id: product.id,
      quantity: 1,
      unit_price: product.price,
      title: product.title,
      image: product.image,
    });
  };

  const handleFavoriteToggle = async (productId, currentFavoriteStatus) => {
    // Check if user is logged in
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();
      formData.append("item_type", "product");
      formData.append("item_id", productId.toString());

      // Choose endpoint based on current favorite status
      const endpoint = currentFavoriteStatus
        ? `${API_BASE_URL}/general/removeFavoriteItem`
        : `${API_BASE_URL}/general/addFavoriteItem`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        // Update the product's favorite status in local state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, is_favorite: !currentFavoriteStatus }
              : product
          )
        );

        // Show success message
        const message = currentFavoriteStatus
          ? "Removed from favorites"
          : "Added to favorites";
        alert(message);
      } else {
        throw new Error(data.message || "Failed to update favorite status");
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
      alert("Unable to update favorite status. Please try again.");
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#502266] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40"></div>

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header Section */}
        <div className="mb-16">
          {/* Title and Explore Link Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#502266]">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-[#FF7F00] hover:text-[#502266] font-medium transition-colors duration-300 flex items-center gap-1 self-start sm:self-auto"
            >
              Explore
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Description Text - Left Aligned */}
          <div className="text-left">
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
              Explore our carefully selected range of high-quality products,
              from home decor to construction materials, all at competitive
              prices.
            </p>
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7F00] to-[#502266] mt-4"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="transition-all duration-300 transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card
                className={`overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                  hoveredCard === product.id ? "scale-105" : "hover:scale-105"
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      product.image ||
                      "/assets/images/tailor.png?height=300&width=400"
                    }
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="bg-[#FF7F00] text-white border-none">
                      ${parseFloat(product.price as string).toFixed(2)}
                    </Badge>
                  </div>

                  {/* Favorite Button */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`rounded-full transition-all duration-300 ${
                        product.is_favorite ||
                        (!isAuthenticated && product.is_favorite)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white/90 text-gray-600 hover:bg-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(product.id, product.is_favorite);
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-300 ${
                          product.is_favorite ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                <CardContent className="bg-[#240F2E] text-white p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-[#FF7F00] mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
                      {product.title}
                    </h3>

                    {/* Category */}
                    <Badge
                      variant="secondary"
                      className="mb-3 bg-white/10 text-white border-white/20"
                    >
                      {product.category?.name ||
                        product.category_title ||
                        "Product"}
                    </Badge>

                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm flex items-center">
                        ⭐⭐⭐⭐⭐
                        <span className="ml-1">(4.5)</span>
                      </p>
                      <span className="text-[#FF7F00] font-semibold">
                        ${parseFloat(product.price as string).toFixed(2)}
                      </span>
                    </div>

                    {/* Stock Level */}
                    {product.stock_level && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-300">
                          Stock: {product.stock_level} available
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105"
                      size="sm"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
