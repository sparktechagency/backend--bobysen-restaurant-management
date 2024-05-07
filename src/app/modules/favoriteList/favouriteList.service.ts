import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { FavoriteList } from "./favoriteList.model";
import { TFavorite } from "./favoriteList.interface";
import { Menu } from "../menu/menu.model";

const insertMenuIntoFavouriteList = async (payload: {
  id: string;
  user: string;
}) => {
  let result;
  // Check if the menu id exists in the user's favorite list
  const favoriteList: any = await FavoriteList.findOne({ user: payload.user });
  let isFavorite = false;
  if (favoriteList && favoriteList.menu.includes(payload.id)) {
    // If the menu id exists, remove it
    result = await FavoriteList.findOneAndUpdate(
      { user: payload.user },
      { $pull: { menu: payload.id } },
      { new: true }
    );
    isFavorite = false;
  } else {
    // If the menu id doesn't exist, add it
    result = await FavoriteList.findOneAndUpdate(
      { user: payload.user },
      { $addToSet: { menu: payload.id } },
      { new: true, upsert: true }
    );
    isFavorite = true;
  }
  const { ...data } = result?.toObject();
  return {
    ...data,
    isFavorite,
  };
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

const getSingleFavoriteDetailsByMenuId = async (id: string) => {
  const result = await Menu.findById(id)
    .populate("restaurant")
    .select("name description avilable restaurant.name image price");
  return result;
};
export const favoriteListServices = {
  insertMenuIntoFavouriteList,
  insertRestaurantIntoDb,
  getAllDataFromFavoriteList,
  removeMenuFromFavoriteList,
  removeRestaurantFromList,
  getSingleFavoriteDetailsByMenuId,
};
