"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle } from "lucide-react";

interface EarningSummary {
  totalRevenue: number;
  pendingPayments: string;
  completedPayouts: number;
}

interface EarningSummaryProps {
  earnings: EarningSummary;
}

export function EarningSummaryCard({ earnings }: EarningSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${earnings.totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total earnings from services
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Payments
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${Number.parseFloat(earnings.pendingPayments).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Awaiting payout</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Payouts
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{earnings.completedPayouts}</div>
          <p className="text-xs text-muted-foreground">Successfully paid out</p>
        </CardContent>
      </Card>
    </div>
  );
}
