export interface SubmissionRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  offering?: string;
  message: string;
  recipientEmail: string;
  status: "new" | "read" | "replied" | "archived";
  emailSent: boolean;
  createdAt: string;
  storageBackend?: "convex" | "local";
}

export interface OrderRecord {
  _id: string;
  itemId: string;
  itemTitle: string;
  itemType: "course" | "gift";
  unitPriceEur: number;
  quantity: number;
  totalEur: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  poemChoice?: string;
  dedicationNotes?: string;
  paypalOrderId?: string;
  paypalReceiverEmail: string;
  paymentMethod: "paypal_sdk" | "paypal_standard";
  status: "pending_payment" | "paid" | "fulfilled" | "cancelled";
  createdAt: string;
}
