import type { Subscription } from "@/types/subscription";

const today = new Date();
const iso = (daysFromNow: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
};

export const mockSubscriptions: Subscription[] = [
  { id: "1", name: "Netflix", category: "Entertainment", amount: 649, cycle: "Monthly", renewalDate: iso(4), status: "Active", paymentSource: "HDFC Credit Card", color: "#E50914", logo: "N", lastUsedDaysAgo: 60 },
  { id: "2", name: "Spotify", category: "Music", amount: 119, cycle: "Monthly", renewalDate: iso(7), status: "Active", paymentSource: "UPI", color: "#1DB954", logo: "S", lastUsedDaysAgo: 1 },
  { id: "3", name: "Amazon Prime", category: "Shopping", amount: 1499, cycle: "Yearly", renewalDate: iso(45), status: "Active", paymentSource: "ICICI Credit Card", color: "#00A8E1", logo: "a", lastUsedDaysAgo: 3 },
  { id: "4", name: "Google One", category: "Cloud", amount: 130, cycle: "Monthly", renewalDate: iso(12), status: "Active", paymentSource: "UPI", color: "#4285F4", logo: "G", lastUsedDaysAgo: 2 },
  { id: "5", name: "YouTube Premium", category: "Entertainment", amount: 129, cycle: "Monthly", renewalDate: iso(9), status: "Active", paymentSource: "HDFC Credit Card", color: "#FF0000", logo: "Y", lastUsedDaysAgo: 0 },
  { id: "6", name: "Electricity Bill", category: "Utilities", amount: 1250, cycle: "Monthly", renewalDate: iso(6), status: "Active", paymentSource: "Net Banking", color: "#F59E0B", logo: "⚡", lastUsedDaysAgo: 0 },
  { id: "7", name: "Internet", category: "Utilities", amount: 899, cycle: "Monthly", renewalDate: iso(14), status: "Active", paymentSource: "Auto Debit", color: "#0EA5E9", logo: "📶", lastUsedDaysAgo: 0 },
  { id: "8", name: "Gym Membership", category: "Fitness", amount: 1500, cycle: "Monthly", renewalDate: iso(20), status: "Paused", paymentSource: "Debit Card", color: "#EF4444", logo: "🏋️", lastUsedDaysAgo: 45 },
  { id: "9", name: "Adobe Creative Cloud", category: "Productivity", amount: 1676, cycle: "Monthly", renewalDate: iso(18), status: "Active", paymentSource: "HDFC Credit Card", color: "#DA1F26", logo: "A", lastUsedDaysAgo: 4 },
  { id: "10", name: "Microsoft 365", category: "Productivity", amount: 489, cycle: "Monthly", renewalDate: iso(22), status: "Active", paymentSource: "UPI", color: "#0078D4", logo: "M", lastUsedDaysAgo: 1 },
  { id: "11", name: "Apple Music", category: "Music", amount: 99, cycle: "Monthly", renewalDate: iso(16), status: "Active", paymentSource: "Apple Pay", color: "#FA243C", logo: "", lastUsedDaysAgo: 8 },
  { id: "12", name: "Notion", category: "Productivity", amount: 0, cycle: "Monthly", renewalDate: iso(28), status: "Active", paymentSource: "Free", color: "#000000", logo: "N", lastUsedDaysAgo: 0 },
  { id: "13", name: "iCloud+", category: "Cloud", amount: 75, cycle: "Monthly", renewalDate: iso(11), status: "Active", paymentSource: "Apple Pay", color: "#3B82F6", logo: "☁", lastUsedDaysAgo: 0 },
  { id: "14", name: "Disney+ Hotstar", category: "Entertainment", amount: 299, cycle: "Monthly", renewalDate: iso(25), status: "Cancelled", paymentSource: "UPI", color: "#1F80E0", logo: "D", lastUsedDaysAgo: 120 },
];

export const monthlySpendTrend = [
  { month: "Jan", amount: 3800 },
  { month: "Feb", amount: 3900 },
  { month: "Mar", amount: 4050 },
  { month: "Apr", amount: 4100 },
  { month: "May", amount: 4180 },
  { month: "Jun", amount: 4215 },
];

export const staticInsights = [
  { id: "i1", title: "Netflix hasn't been used for 60 days", detail: "Consider cancelling to save ₹649/month.", severity: "warning" as const, action: "Cancel Netflix" },
  { id: "i2", title: "You have two music subscriptions", detail: "Spotify and Apple Music together cost ₹218/month.", severity: "info" as const, action: "Review" },
  { id: "i3", title: "Entertainment accounts for 45% of spending", detail: "Try reducing it below 30% for healthier budgeting.", severity: "warning" as const, action: "See breakdown" },
  { id: "i4", title: "Renew before next week", detail: "3 subscriptions are due within 7 days.", severity: "info" as const, action: "View renewals" },
  { id: "i5", title: "You may save ₹900/month", detail: "Based on your unused and duplicate subscriptions.", severity: "success" as const, action: "See suggestions" },
  { id: "i6", title: "Entertainment spending exceeds your budget", detail: "You set ₹1,000/month; current is ₹1,077.", severity: "warning" as const, action: "Adjust budget" },
];
