"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, DollarSign } from "lucide-react";

interface TopCustomer {
  user_id: number;
  quantity: number;
  total_amount: string;
}

interface TopCustomersProps {
  customers: TopCustomer[];
}

export function TopCustomers({ customers }: TopCustomersProps) {
  // Group customers by user_id and sum quantities and amounts
  const groupedCustomers = customers.reduce((acc, customer) => {
    const userId = customer.user_id;
    if (acc[userId]) {
      acc[userId].quantity += customer.quantity;
      acc[userId].total_amount += Number.parseFloat(customer.total_amount);
    } else {
      acc[userId] = {
        user_id: userId,
        quantity: customer.quantity,
        total_amount: Number.parseFloat(customer.total_amount),
      };
    }
    return acc;
  }, {} as Record<number, { user_id: number; quantity: number; total_amount: number }>);

  const sortedCustomers = Object.values(groupedCustomers)
    .sort((a, b) => b.total_amount - a.total_amount)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Top Customers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Users className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No customers data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {`U${customer.user_id}`.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      Customer #{customer.user_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {customer.quantity} orders
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />$
                  {customer.total_amount.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
