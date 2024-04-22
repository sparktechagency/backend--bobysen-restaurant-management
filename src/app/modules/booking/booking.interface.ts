import { ObjectId } from "mongodb";
export interface TBook {
  restaurant: ObjectId;
  date: Date;
  time: string;
  user: ObjectId;
  seats: string | number;
}

export interface TBooking {
  user: ObjectId;
  id: string | number;
  table: ObjectId;
  date: Date;
  time: string;
  status: "active" | "cancelled";
}
