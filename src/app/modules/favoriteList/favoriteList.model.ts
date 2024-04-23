import { model, Schema } from "mongoose";
import { TFavorite } from "./favoriteList.interface";

const favoriteSchema = new Schema<TFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    menu: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    restaurants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const FavoriteList = model<TFavorite>("FavouriteList", favoriteSchema);
