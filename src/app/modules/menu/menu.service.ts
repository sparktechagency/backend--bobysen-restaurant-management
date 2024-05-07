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
  const MenuModel = new QueryBuilder(Menu.find(), query)
    .search(["name"])
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

const getSingleMenu = async (id: string, userId: string) => {
  const result = await Menu.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "favouritelists",
        let: { menuId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  { $in: ["$$menuId", "$menu"] },
                ],
              },
            },
          },
          {
            $project: { _id: 0 },
          },
        ],
        as: "isFavourite",
      },
    },
    {
      $addFields: {
        isFavourite: {
          $cond: {
            if: { $gt: [{ $size: "$isFavourite" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    // Project all fields from the Menu collection
    {
      $project: {
        _id: 1,
        category: 1,
        image: 1,
        restaurant: 1,
        description: 1,
        name: 1,
        price: 1,
        owner: 1,
        available: 1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        isFavourite: 1,
      },
    },
  ]);
  return result[0] ? result[0] : {};
};

// get all menu for vendor
const getAllTablesForOwner = async (userId: string) => {
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
        from: "menus",
        localField: "_id",
        foreignField: "restaurant",
        as: "menus",
      },
    },
  ]);

  return result[0];
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
          avgReviews: 1,
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
  getAllTablesForOwner,
  updateMenu,
  deleteMenu,
};

export const reviewServices = {
  insertReviewIntoDb,
  getAllReviews,
};
