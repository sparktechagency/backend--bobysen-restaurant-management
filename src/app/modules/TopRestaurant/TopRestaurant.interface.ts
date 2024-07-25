import { ObjectId } from "mongoose";
interface location {
  latitude: number;
  longitude: number;
  coordinates: [number];
  type: { type: string };
}
export interface TtopRestaurant {
  restaurant: ObjectId;
  startDate: string;
  location: location;
  endDate: string;
  isExpired: boolean;
  isDeleted: boolean;
}
