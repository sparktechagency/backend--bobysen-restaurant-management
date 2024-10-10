import { ObjectId } from "mongoose";

export interface Ibanner {
  image: string;
  restaurant: ObjectId;
}
