"use client";
import { Wallet, ShoppingBag, History } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export function Overview() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Avatar className="h-20 w-20 aspect-square">
            <AvatarImage className="aspect-square" src="/avatars/01.png" />
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Good evening Lola
            </h2>
            <p className="text-muted-foreground">How are you today? 😊</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="products" className="space-y-4">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <Wallet className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenditure</p>
              <h3 className="text-2xl font-semibold">$400.45</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Image
              src="/placeholder-user.jpg"
              alt="Avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-orange-600">
              5 Pending Transaction
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-purple-50 p-4">
              <ShoppingBag className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Orders Received</p>
              <h3 className="text-2xl font-semibold">45</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Image
              src="/placeholder-user.jpg"
              alt="Avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-purple-600">
              5 Pending Transaction
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-50 p-4">
              <History className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Orders Refunds</p>
              <h3 className="text-2xl font-semibold">3</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Image
              src="/placeholder-user.jpg"
              alt="Avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-pink-600">5 Pending Transaction</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
