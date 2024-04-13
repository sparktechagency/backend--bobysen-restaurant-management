import { Model, ObjectId } from "mongoose";

export interface TMenu {
  category: ObjectId;
  restaurant: ObjectId;
  name: string;
  description?: string;
  price: number;
  owner: ObjectId;
  avilable: boolean;
  isDeleted: boolean;
}
export interface MenuModel extends Model<TMenu> {}
