import { Model, ObjectId } from "mongoose";

export interface Ttable {
  tableNo: string;
  seat: number | string;
  tableName?: string;
  restaurant: ObjectId;
  isDeleted: boolean;
  isBooked: boolean;
}
export interface TableModel extends Model<Ttable> {
  isUniqueTable(
    restaurantId: ObjectId,
    tableNo: string | number
  ): Promise<Ttable>;
}
