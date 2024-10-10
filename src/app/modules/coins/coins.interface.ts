import { ObjectId } from "mongoose";

export interface Icoin {
  customer: ObjectId;
  coins: number;
  status: "pending" | "accepted" | "rejected";
  isDeleted: boolean;
}
