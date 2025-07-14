"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, Shield, Loader2 } from "lucide-react";
import { getUserById } from "@/actions/admin/user-api";
import { useToast } from "@/hooks/use-toast";

interface ViewUserDialogProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserDialog({ userId, onOpenChange }: ViewUserDialogProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await getUserById(userId);

      if (error) {
        throw new Error(error);
      }

      setUser(data?.user || data);
    } catch (error) {
          console.log(error)

      toast({
        title: "Error",
        description: "Failed to fetch user details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = (type: string | number) => {
    const types: Record<string, string> = {
      "1": "Admin",
      "2": "Vendor",
      "3": "Artisan",
      "4": "Buyer",
    };
    return types[type?.toString()] || "Unknown";
  };

  if (!userId) return null;

  return (
    <Dialog open={!!userId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user.user_photo || "/placeholder.svg"}
                  alt={`${user.firstname} ${user.lastname}`}
                />
                <AvatarFallback>
                  {user.firstname?.charAt(0) || "U"}
                  {user.lastname?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {user.firstname} {user.lastname}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {getUserTypeLabel(user.user_type)}
                  </Badge>
                  <Badge
                    variant={
                      user.active_status === 1 ? "default" : "destructive"
                    }
                  >
                    {user.active_status === 1 ? "Active" : "Inactive"}
                  </Badge>
                  <Badge
                    variant={
                      user.verified_status === "1" ? "default" : "secondary"
                    }
                  >
                    {user.verified_status === "1" ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* User Information Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Address:</span>
                      <span className="text-sm">{user.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Updated {new Date(user.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">User ID:</span>
                    <span className="text-sm">#{user.id}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">User not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
