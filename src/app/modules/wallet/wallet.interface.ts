import { ObjectId } from "mongodb";

interface paymentHistory {
  amount: number;
  date: string;
  method: string;
  percentage: Number;
  subTotal: number;
}
export interface TWallet {
  owner?: ObjectId;
  amount: number;
  due: number;
  totalPaid: number;
  lastPaymentDate: String;
  isDeleted: boolean;
  paymentHistory: [paymentHistory];
}
