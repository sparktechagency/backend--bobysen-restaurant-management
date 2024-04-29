import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { tableServices } from "./table.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

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
    message: "tables retrived successfully",
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
    message: "table retrived successfully",
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
  const result = await tableServices.getAllTablesForVendor(req?.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tables retrived successfully",
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
