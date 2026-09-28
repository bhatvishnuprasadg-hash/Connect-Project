export const CATEGORIES = [
  { slug: "electrician", label: "Electrician", icon: "⚡" },
  { slug: "plumber", label: "Plumber", icon: "🔧" },
  { slug: "ac-repair", label: "AC Technician", icon: "❄️" },
  { slug: "carpenter", label: "Carpenter", icon: "🪚" },
  { slug: "painter", label: "Painter", icon: "🎨" },
  { slug: "cleaning", label: "Home Cleaning", icon: "🧹" },
  { slug: "appliance-repair", label: "Appliance Repair", icon: "🛠️" },
  { slug: "pest-control", label: "Pest Control", icon: "🐜" },
];

export const BOOKING_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  PAYMENT_PENDING: "Payment Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  RESCHEDULE_REQUESTED: "Reschedule Requested",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
};

// Statuses at which a customer may still request reschedule / cancellation
export const EDITABLE_STATUSES = [
  BOOKING_STATUS.PENDING,
  BOOKING_STATUS.ACCEPTED,
  BOOKING_STATUS.PAYMENT_PENDING,
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.RESCHEDULED,
];

export const CANCELLATION_REASONS = [
  "Change of plans",
  "Service not required",
  "Wrong booking",
  "Found another provider",
  "Other",
];

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "📲" },
  { id: "credit-card", label: "Credit Card", icon: "💳" },
  { id: "debit-card", label: "Debit Card", icon: "💳" },
  { id: "net-banking", label: "Net Banking", icon: "🏦" },
  { id: "wallet", label: "Wallet", icon: "👛" },
];

export const STATUS_STYLES = {
  [BOOKING_STATUS.PENDING]: "bg-amber-100 text-amber-700",
  [BOOKING_STATUS.ACCEPTED]: "bg-sky-100 text-sky-700",
  [BOOKING_STATUS.REJECTED]: "bg-rose-100 text-rose-700",
  [BOOKING_STATUS.PAYMENT_PENDING]: "bg-orange-100 text-orange-700",
  [BOOKING_STATUS.CONFIRMED]: "bg-emerald-100 text-emerald-700",
  [BOOKING_STATUS.IN_PROGRESS]: "bg-violet-100 text-violet-700",
  [BOOKING_STATUS.COMPLETED]: "bg-green-100 text-green-700",
  [BOOKING_STATUS.RESCHEDULE_REQUESTED]: "bg-fuchsia-100 text-fuchsia-700",
  [BOOKING_STATUS.RESCHEDULED]: "bg-indigo-100 text-indigo-700",
  [BOOKING_STATUS.CANCELLED]: "bg-ink-200 text-ink-600",
};

export const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
];
