"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ServiceCardProps {
  id: string;
  title: string;
  price: number;
  description: string;
  rating: number;
  userId: string;
  reviews: number;
  isNew?: boolean;
  imageUrl: string;
}

export function ServiceCard({
  id,
  userId,
  title,
  price,
  rating,
  reviews,
  isNew,
  imageUrl,
  description,
}: ServiceCardProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/booking/?serviceId=${id}`);
  };

  return (
    <div className="rounded-lg bg-purple-900 p-4 text-white">
      {isNew && <Badge className="mb-2 bg-purple-400">NEW</Badge>}
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover bg-gray-300"
        />
      </div>
      <div className="flex flex-col">
        <p className="mt-2">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
            <span className="text-sm text-gray-300">({reviews})</span>
          </div>
          <div className="text-sm">From ${price}</div>
        </div>
      </div>
      <Button
        onClick={() => handleRedirect()}
        className="mt-4 w-full bg-white text-purple-900 hover:bg-gray-100"
      >
        Book now
      </Button>
    </div>
  );
}
