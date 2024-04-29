import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { Ttable } from "./table.interface";
import { Table } from "./table.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Restaurant } from "../restaurant/restaurant.model";
import mongoose from "mongoose";

const insertTableIntoDB = async (payload: Ttable) => {
  const isUniqueTableNo = await Table.isUniqueTable(
    payload?.restaurant,
    payload?.tableNo
  );
  if (isUniqueTableNo) {
    throw new AppError(httpStatus.CONFLICT, "table no should be unique");
  }
  const result = await Table.create(payload);
  return result;
};

const getAllTables = async (query: Record<string, any>) => {
  const tableModel = new QueryBuilder(
    Table.find().populate("restaurant"),
    query
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await tableModel.modelQuery;
  const meta = await tableModel.countTotal();
  return {
    data,
    meta,
  };
};

const getSingleTable = async (id: string) => {
  const result = await Table.findById(id).populate("restaurant");

  return result;
};

const getAllTablesForVendor = async (userId: string) => {
  const result = await Restaurant.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
    {
      $lookup: {
        from: "tables",
        localField: "_id",
        foreignField: "restaurant",
        as: "tables",
      },
    },
  ]);

  return result[0];
};

const updateTable = async (id: string, payload: Partial<Ttable>) => {
  const result = await Table.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
export const tableServices = {
  insertTableIntoDB,
  getAllTables,
  getSingleTable,
  getAllTablesForVendor,
  updateTable,
};
