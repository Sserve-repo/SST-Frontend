"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

interface ProductTableProps {
  products: IncompleteProduct[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

interface IncompleteProduct {
  id: string;
  name: string;
  dateAdded: string;
  price: number;
  category: string;
  stockLevel: string;
  status: string;
  views: string;
  images: string[];
  description: string;
  shippingCost: number;
  hasDiscount: boolean;
}
// interface ProductTableProps {
//   products: IncompleteProduct[];
//   onEdit: (product: IncompleteProduct) => void;
//   onDelete: (product: IncompleteProduct) => void;
// }

const getStatusColor = (status: Product["status"]) => {
  switch (status) {
    case "fully-stocked":
      return "bg-emerald-100 text-emerald-800";
    case "low-on-stock":
      return "bg-purple-100 text-purple-800";
    case "out-of-stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    setSelectedProducts((prev) =>
      prev.length === products.length ? [] : products.map((p) => p.id)
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedProducts.length === products.length}
              onCheckedChange={toggleAll}
            />
          </TableHead>
          <TableHead>PRODUCT NAME</TableHead>
          <TableHead>DATE ADDED</TableHead>
          <TableHead>UNIT PRICE</TableHead>
          <TableHead>CATEGORY</TableHead>
          <TableHead>STOCK LEVEL</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead>VIEWS</TableHead>
          <TableHead className="w-12">ACTION</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onCheckedChange={() => toggleProduct(product.id)}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Image
                  src={product.images[0] || "/assets/images/image-placeholder.png"}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md aspect-square"
                />
                <span className="font-medium">{product.name}</span>
              </div>
            </TableCell>
            <TableCell>{product.dateAdded}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.stockLevel}</TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={getStatusColor(product.status)}
              >
                {product.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {product.views}
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuItem onClick={() => onEdit(product)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(product)}
                  >
                    Delete
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
