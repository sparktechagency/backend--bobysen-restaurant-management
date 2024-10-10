import { ObjectId } from "mongoose";

export interface Ievents {
  title: string;
  restaurant: ObjectId;
  date: string;
  description: string;
  image: string;
  isDeleted: boolean;
  isActive: boolean;
}
