import { ObjectId } from "mongodb";

interface CartItem {
  item: ObjectId;
  quantity: number;
  amount: number;
}

export interface TCart {
  user: ObjectId;
  restaurant: ObjectId;
  items: CartItem[];
  date: string;
  totalAmount: number;
  discount: number;
  isDeleted?: boolean;
  paid?: boolean;
}
