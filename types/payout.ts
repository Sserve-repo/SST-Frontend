export interface PendingPayout {
  user_id: number;
  user_name: string;
  payout_type: "product" | "service";
  type: "product" | "service";
  total_items: number;
  total_amount: string;
  latest_date: string;
}

export interface CompletedPayout {
  user_id: number;
  user_name: string;
  payout_type: "product" | "service";
  type: "product" | "service";
  total_items: number;
  total_amount: string;
  latest_date: string;
}

export interface AdminPayoutStats {
  totalPending: number;
  totalCompleted: number;
  pendingAmount: number;
  completedAmount: number;
}
