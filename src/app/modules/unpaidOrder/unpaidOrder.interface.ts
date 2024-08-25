import { ObjectId } from "mongoose";

export interface IunpaidOrderSchema {
  cart: ObjectId;
  id_order: string;
  token: string;
  customer: ObjectId;
  isDeleted: boolean;
}
