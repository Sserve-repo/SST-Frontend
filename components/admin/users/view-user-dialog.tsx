"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getUserById } from "@/actions/admin/user-api";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface ViewUserDialogProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

interface UserDetails {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  user_photo: string | null;
  user_type: string;
  active_status: number;
  verified_status: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role?: {
    id: number;
    name: string;
  };
}

export function ViewUserDialog({ userId, onOpenChange }: ViewUserDialogProps) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: apiError } = await getUserById(userId);
      console.log("Fetched user data:", data);
      if (apiError) {
        throw new Error(apiError);
      }

<<<<<<< HEAD
      setUser(data?.user || data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch user details.",
        variant: "destructive",
      });
=======
      if (data) {
        setUser(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load user details"
      );
>>>>>>> origin/lastest-update
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "1": "Admin",
      "2": "Vendor",
      "3": "Artisan",
      "4": "Buyer",
    };
    return types[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: number) => {
    return status === 1 ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getVerificationIcon = (verified: string | null) => {
    return verified === "1" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-yellow-500" />
    );
  };

  return (
    <Dialog open={!!userId} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchUser}
              className="text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={
                    user.user_photo || "/assets/images/image-placeholder.png"
                  }
                  alt={`${user.firstname} ${user.lastname}`}
                />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {user.firstname} {user.lastname}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {getUserTypeLabel(user.user_type)}
                  </Badge>
                  <Badge
                    variant={
                      user.active_status === 1 ? "default" : "destructive"
                    }
                    className="flex items-center gap-1"
                  >
                    {getStatusIcon(user.active_status)}
                    {user.active_status === 1 ? "Active" : "Banned"}
                  </Badge>
                  <Badge
                    variant={
                      user.verified_status === "1" ? "default" : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    {getVerificationIcon(user.verified_status)}
                    {user.verified_status === "1" ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* User Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">User Type</p>
                    <p className="font-medium">
                      {getUserTypeLabel(user.user_type)}
                    </p>
                  </div>
                  {user.role && (
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">{user.role.name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium flex items-center gap-2">
                      {getStatusIcon(user.active_status)}
                      {user.active_status === 1 ? "Active" : "Banned"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Account Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Created
                  </p>
                  <p className="font-medium">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(user.updated_at)}</p>
                </div>
                {user.email_verified_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Email Verified
                    </p>
                    <p className="font-medium">
                      {formatDate(user.email_verified_at)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
