export type BillingCycle = "Monthly" | "Yearly" | "Weekly" | "Quarterly";
export type SubStatus = "Active" | "Paused" | "Cancelled";
export type Category =
  | "Entertainment"
  | "Music"
  | "Productivity"
  | "Utilities"
  | "Fitness"
  | "Cloud"
  | "Shopping"
  | "Other";

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  amount: number;
  cycle: BillingCycle;
  renewalDate: string; // ISO date
  status: SubStatus;
  paymentSource: string;
  color: string; // brand color
  logo?: string; // letter or emoji fallback
  lastUsedDaysAgo?: number;
}
