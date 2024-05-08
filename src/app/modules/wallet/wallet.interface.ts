import { ObjectId } from "mongodb";

interface paymentHistory {
  amount: number;
  date: Date;
  method: string;
}
export interface TWallet {
  owner?: ObjectId;
  amount: number;
  due: number;
  totalPaid: number;
  lastPaymentDate: Date;
  isDeleted: boolean;
  paymentHistory: [paymentHistory];
}
