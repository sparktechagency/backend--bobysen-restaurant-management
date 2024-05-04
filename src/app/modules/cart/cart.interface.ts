import { ObjectId } from "mongodb";

interface CartItem {
  item: ObjectId;
  quantity: number;
  amount: number;
}
export enum statusValue {
  unpaid = "unpaid",
  partiallyPaid = "partially_paid",
  paid = "paid",
}

export interface TCart {
  user: ObjectId;
  booking: ObjectId;
  items: CartItem[];
  date: string;
  totalAmount: number;
  subTotal: number;
  discount: number;
  isDeleted?: boolean;
  paid?: boolean;
  totalPaid: number;
  totalDue: number;
  status: statusValue;
}
export interface TRemoveItem {
  itemId: ObjectId;
  amount: number;
}
