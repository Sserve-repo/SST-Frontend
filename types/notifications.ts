
export type Notification = {
    id: string;
    title: string;
    message: string;
    targetAudience: string[];
    status: "sent" | "scheduled" | "draft" | string; // extend as needed
    scheduledFor: string | null;
    sentAt: string | null;
    createdAt: string;
    stats?: {
      sent: number;
      delivered: number;
      read: number;
    } | null;
  };
  