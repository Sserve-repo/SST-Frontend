"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createMessage } from "@/actions/dashboard/vendors";

interface ArtisanMessageInitiationModalProps {
  recipientId: string | number;
  recipientName: string;
  recipientAvatar?: string;
  serviceName?: string;
  children?: React.ReactNode;
}

export function ArtisanMessageInitiationModal({
  recipientId,
  recipientName,
  recipientAvatar,
  serviceName,
  children,
}: ArtisanMessageInitiationModalProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      // Create message API call
      const formData = new FormData();
      formData.append("recipient_id", String(recipientId));
      formData.append("message", message.trim());
      if (serviceName) {
        formData.append("subject", `Inquiry about ${serviceName}`);
      }

      const response = await createMessage(formData);
      const data = await response?.json();
      if (data?.status === true) {
        setMessage("");
        toast.success("Message added successfully");
      } else {
        toast.error("Failed to add Message");
      }

      setMessage("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultMessage = serviceName
    ? `Hi! I'm interested in your product "${serviceName}". Could you provide more details?`
    : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={recipientAvatar || "/assets/images/image-placeholder.png"}
                alt={recipientName}
              />
              <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{recipientName}</p>
              {serviceName && (
                <p className="text-sm text-muted-foreground">
                  Re: {serviceName}
                </p>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={defaultMessage || "Type your message here..."}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
