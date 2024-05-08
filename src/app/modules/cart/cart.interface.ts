import { ObjectId } from "mongodb";

interface CartItem {
  item: ObjectId;
  quantity: number;
  amount: number;
  isPaid: boolean;
}
export enum statusValue {
  unpaid = "unpaid",
  partiallyPaid = "partially_paid",
  paid = "paid",
}

interface TTransactions {
  id_form?: string;
  orderId: string;
  checksum?: string;
  status: boolean;
  amount: number;
  date: Date;
}
export interface TCart {
  user: ObjectId;
  owner: ObjectId;
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
  transactions: [TTransactions];
}
export interface TRemoveItem {
  itemId: ObjectId;
  amount: number;
}
