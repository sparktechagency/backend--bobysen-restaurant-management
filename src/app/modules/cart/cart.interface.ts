import { ObjectId } from "mongodb";

interface CartItem {
  item: ObjectId;
  quantity: number;
  amount: number;
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
}
export interface TRemoveItem {
  itemId: ObjectId;
  amount: number;
}
