import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Restaurant } from "../restaurant/restaurant.model";
import { Ttable } from "./table.interface";
import { Table } from "./table.model";

const insertTableIntoDB = async (payload: Ttable) => {
  const isUniqueTableNo = await Table.isUniqueTable(
    payload?.restaurant,
    payload?.tableNo
  );
  if (isUniqueTableNo) {
    throw new AppError(httpStatus.CONFLICT, "Table no should be unique.");
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
const getAllTablesForVendor = async (query: any) => {
  const matchCondition: any = {
    owner: new mongoose.Types.ObjectId(query?.user),
  };

  // Dynamically add the restaurant condition
  if (query?.restaurant) {
    matchCondition["restaurant"] = new mongoose.Types.ObjectId(
      query.restaurant
    );
  }
  console.log(matchCondition);
  const result = await Restaurant.aggregate([
    { $match: matchCondition },
    { $project: { debug: "$$ROOT" } },
    {
      $lookup: {
        from: "tables",
        localField: "_id",
        foreignField: "restaurant",
        as: "tables",
      },
    },
    {
      $project: {
        _id: 1,
        tables: 1, // Return tables directly in the result
      },
    },
  ]);

  return result.length ? result[0] : null; // Return null if no result
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
