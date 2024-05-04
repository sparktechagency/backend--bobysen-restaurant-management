import { ObjectId } from "mongodb";
export enum modeType {
  Cart = "Cart",
  Booking = "Booking",
}
export interface TNotification {
  receiver: ObjectId;
  message: string;
  description?: string;
  refference: ObjectId;
  model_type: modeType;
  date?: Date;
  read: boolean;
  isDeleted: boolean;
}
