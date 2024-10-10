import { ObjectId } from "mongodb";
export interface TBook {
  restaurant: ObjectId;
  date: string;
  time: string;
  user: ObjectId;
  event?: ObjectId;
  seats: number;
  customerNumber: string;
}
export interface EmailContext {
  name: string;
  email: string;
  date: string;
  seats: number;
  arrivalTime: string;
  restaurant: string;
  address: string;
}
export interface TBooking {
  user: ObjectId;
  id: string | number;
  table: ObjectId;
  restaurant: ObjectId;
  date: string;
  event: ObjectId;
  ticket: string;
  endTime: string;
  time: string;
  status: "active" | "cancelled" | "completed";
  isReviewed: boolean;
}
