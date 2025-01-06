import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { tableServices } from "./table.service";

const insertTableIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await tableServices.insertTableIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "table added successfully",
    data: result,
  });
  return result;
});
const getAllTables = catchAsync(async (req: Request, res: Response) => {
  const result = await tableServices.getAllTables(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "tables retrieved successfully",
    data: result?.data,
    meta: result?.meta,
  });
  return result;
});

const getSingleTable = catchAsync(async (req: Request, res: Response) => {
  const result = await tableServices.getSingleTable(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "table retrieved successfully",
    data: result,
  });
  return result;
});
const updateTable = catchAsync(async (req: Request, res: Response) => {
  const result = await tableServices.updateTable(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Table updated successfully",
    data: result,
  });
  return result;
});
const getVendorAllTables = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  query["user"] = req.user.userId;

  const result = await tableServices.getAllTablesForVendor(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tables retrieved successfully",
    data: result,
  });
  return result;
});

export const tableControllers = {
  insertTableIntoDb,
  getAllTables,
  getSingleTable,
  updateTable,
  getVendorAllTables,
};
