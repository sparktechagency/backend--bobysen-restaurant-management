import { ObjectId } from "mongoose";

export interface TMenuCategory {
  owner: ObjectId;
  title: string;
  isDeleted: boolean;
}
