import { ObjectId } from "mongoose";

export interface TtopRestaurant {
  restaurant: ObjectId;
  startDate: string;
  endDate: string;
  isExpired: boolean;
  isDeleted: boolean;
}
