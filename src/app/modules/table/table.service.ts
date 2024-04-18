import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { Ttable } from "./table.interface";
import { Table } from "./table.model";
import QueryBuilder from "../../builder/QueryBuilder";

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

export const tableServices = {
  insertTableIntoDB,
  getAllTables,
  getSingleTable,
};
