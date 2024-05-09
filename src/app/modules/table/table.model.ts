import { Schema, model } from "mongoose";
import { TableModel, Ttable } from "./table.interface";
const tableSchema = new Schema<Ttable, TableModel>(
  {
    tableNo: {
      type: String,
      required: [true, "table no is requried"],
      // unique: true,
    },
    tableName: {
      type: String,
      default: "",
    },
    seats: {
      type: String,
      required: [true, "total seat is required"],
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "restaurant id is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
tableSchema.statics.isUniqueTable = async function (
  id: string,
  tableNo: string
) {
  return await Table.findOne({ restaurant: id, tableNo: tableNo });
};
// filter out deleted documents
tableSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
tableSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
tableSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
export const Table = model<Ttable, TableModel>("Table", tableSchema);
