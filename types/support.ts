export type SupportTicket = {
    id: string;
    user: {
      name: string;
      email: string;
      avatar: string;
    };
    type: "technical" | "billing" | "feature_request" | string;
    status: "open" | "in_progress" | "resolved" | string;
    priority: "low" | "medium" | "high" | string;
    subject: string;
    description: string;
    assignedTo: {
      id: string;
      name: string;
      email: string;
      avatar: string;
    } | null;
    createdAt: string;
    updatedAt: string;
    messages: {
      id: string;
      sender: "user" | "admin" | string;
      content: string;
      timestamp: string;
    }[];
    internalNotes: {
      id: string;
      author: string;
      content: string;
      timestamp: string;
    }[];
  };
  