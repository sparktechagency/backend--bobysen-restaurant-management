import { ObjectId } from "mongoose";

export interface TMenuCategory {
  user: ObjectId;
  image: string;
  title: string;
  isDeleted: boolean;
}
