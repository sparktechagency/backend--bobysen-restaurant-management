import { ObjectId } from "mongodb";

export interface TBooking {
  user: ObjectId;
  id: string | number;
  table: ObjectId;
  date: Date;
  time: string;
}
