import { ObjectId } from "mongoose";

export interface TMenuCategory {
  user: ObjectId;
  image: string;
  restaurant: ObjectId;
  title: string;
  isDeleted: boolean;
}
