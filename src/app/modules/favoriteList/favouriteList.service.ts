import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { FavoriteList } from "./favoriteList.model";

const insertMenuIntoFavouriteList = async (payload: {
  id: string;
  user: string;
}) => {
  const result = await FavoriteList.findOneAndUpdate(
    { user: payload?.user },
    {
      $addToSet: {
        menu: payload?.id,
      },
      $set: {
        user: payload?.user,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};
const insertRestaurantIntoDb = async (payload: {
  id: string;
  user: string;
}) => {
  const result = await FavoriteList.findOneAndUpdate(
    { user: payload?.user },
    {
      $addToSet: {
        restaurants: payload?.id,
      },
      $set: {
        user: payload?.user,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};

const removeMenuFromFavoriteList = async (id: string, menu: string) => {
  const result = await FavoriteList.findByIdAndUpdate(
    id,
    {
      $pull: {
        menu: menu,
      },
    },
    { new: true }
  );
  return result;
};
const removeRestaurantFromList = async (id: string, restaurant: string) => {
  const result = await FavoriteList.findByIdAndUpdate(
    id,
    {
      $pull: {
        restaurants: restaurant,
      },
    },
    { new: true }
  );
  return result;
};
const getAllDataFromFavoriteList = async (query: Record<string, any>) => {
  const FavoriteModel = new QueryBuilder(
    FavoriteList.find().populate(query?.fields?.split(",").join(" ")),
    query
  )
    .search([])
    .filter()
    .paginate()
    .fields()
    .sort();
  const data = await FavoriteModel.modelQuery;
  const meta = await FavoriteModel.countTotal();
  return {
    data,
    meta,
  };
};
export const favoriteListServices = {
  insertMenuIntoFavouriteList,
  insertRestaurantIntoDb,
  getAllDataFromFavoriteList,
  removeMenuFromFavoriteList,
  removeRestaurantFromList,
};
