import { ObjectId } from "mongoose";

export interface Ievents {
  title: string;
  restaurant: ObjectId;
  date: string;
  description: string;
  startDate: string;
  endDate: string;
  images: string;
  isDeleted: boolean;
  isActive: boolean;
  entryFee: number;
}
