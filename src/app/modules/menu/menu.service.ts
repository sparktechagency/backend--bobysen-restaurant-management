import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { deleteFile } from "../../utils/fileHelper";
import { TMenu, TReview } from "./menu.inteface";
import { Menu, Review } from "./menu.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { Restaurant } from "../restaurant/restaurant.model";

const insertMenuIntoDb = async (payload: TMenu): Promise<TMenu> => {
  const result = await Menu.create(payload);
  return result;
};

const getAllMenu = async (query: { [key: string]: any }) => {
  const MenuModel = new QueryBuilder(
    Menu.find().populate("owner category restaurant"),
    query
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await MenuModel.modelQuery;
  const meta = await MenuModel.countTotal();
  return {
    data,
    meta,
  };
};

const getSingleMenu = async (id: string) => {
  const result = await Menu.findById(id).populate("owner");
  return result;
};
// update menu here
const updateMenu = async (id: string, payload: Partial<TMenu>) => {
  const findMenu = await Menu.findById(id);
  const result = await Menu.findByIdAndUpdate(id, payload, { new: true });
  if (payload?.image && result) {
    await deleteFile(findMenu?.image as string);
  }
  return result;
};
const deleteMenu = async (id: string) => {
  const result = await Menu.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

// get Reivew

const insertReviewIntoDb = async (payload: TReview): Promise<TReview> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Review.create([payload], { session });
    if (!result[0]) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "something went wrong. please try again"
      );
    }
    await Restaurant.findByIdAndUpdate(
      result[0]?.restaurant,
      {
        $inc: {
          totalReviews: 1,
        },
      },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();
    return result[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getAllReviews = async (itemId: string) => {
  const result = Review.find({ item: itemId }).populate("user");
  return result;
};

export const menuServices = {
  insertMenuIntoDb,
  getAllMenu,
  getSingleMenu,
  updateMenu,
  deleteMenu,
};

export const reviewServices = {
  insertReviewIntoDb,
  getAllReviews,
};
