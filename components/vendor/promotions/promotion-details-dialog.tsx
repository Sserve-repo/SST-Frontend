"use client";

import { Calendar, Percent, DollarSign, Users, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Promotion } from "@/types/promotions";

interface PromotionDetailsDialogProps {
  promotion: Promotion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromotionDetailsDialog({
  promotion,
  open,
  onOpenChange,
}: PromotionDetailsDialogProps) {
  const getStatusBadge = (status: Promotion["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Upcoming
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Expired
          </Badge>
        );
      case "disabled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Disabled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") {
      return `${value}%`;
    }
    return `$${value.toFixed(2)}`;
  };

  const usagePercentage =
    promotion.usageLimit > 0
      ? (promotion.usageCount / promotion.usageLimit) * 100
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{promotion.name}</DialogTitle>
            {getStatusBadge(promotion.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {promotion.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{promotion.description}</p>
            </div>
          )}

          {/* Discount Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {promotion.type === "percentage" ? (
                    <Percent className="h-4 w-4 text-blue-600" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-green-600" />
                  )}
                  Discount Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatValue(promotion.type, promotion.value)}
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {promotion.type.replace("_", " ")} discount
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>
                      {promotion.usageCount} / {promotion.usageLimit}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {promotion.usageLimit > 0
                      ? `${usagePercentage.toFixed(1)}% used`
                      : "Unlimited usage"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Duration */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                Promotion Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(promotion.startDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(promotion.endDate)}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Duration:{" "}
                      {Math.ceil(
                        (promotion.endDate.getTime() -
                          promotion.startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Created</p>
              <p className="text-muted-foreground">
                {formatDate(promotion.createdAt)}
              </p>
            </div>
            <div>
              <p className="font-medium">Last Updated</p>
              <p className="text-muted-foreground">
                {formatDate(promotion.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
