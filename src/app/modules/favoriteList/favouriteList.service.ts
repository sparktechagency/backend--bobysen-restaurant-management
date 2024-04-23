import QueryBuilder from "../../builder/QueryBuilder";
import { FavoriteList } from "./favoriteList.model";

const insertMenuIntoFavouriteList = async (payload: {
  id: string;
  userId: string;
}) => {
  const result = await FavoriteList.findByIdAndUpdate(
    { user: payload?.userId },
    {
      $addToSet: {
        menu: payload?.id,
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
  userId: string;
}) => {
  const result = await FavoriteList.findByIdAndUpdate(
    { user: payload?.userId },
    {
      $addToSet: {
        restaurants: payload?.id,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};

const removeFromFavoriteList = async (id: string, payload: any) => {
  const update: any = {};
  if (payload?.menu) {
    update["menu"] = { $pull: payload?.menu };
  } else if (payload?.restaurant) {
    update["restaurant"] = { $pull: payload?.restaurant };
  }
  const result = await FavoriteList.findByIdAndUpdate(id, update, {
    new: true,
  });
  return result;
};

const getAllDataFromFavoriteList = async (query: Record<string, any>) => {
  const FavoriteModel = new QueryBuilder(
    FavoriteList.find().populate("menu restaurants"),
    query
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();
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
  removeFromFavoriteList,
};
