import { ObjectId } from "mongodb";
export interface TFavorite {
  menu?: Array<ObjectId>;
  restaurants?: Array<ObjectId>;
  user: ObjectId;
}
