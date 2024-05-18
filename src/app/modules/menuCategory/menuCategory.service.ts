import { deleteFile } from "../../utils/fileHelper";
import { TMenuCategory } from "./menuCategory.interface";
import { MenuCategory } from "./menuCategory.model";

const insertMenuCategoryIntoDb = async (
  payload: TMenuCategory
): Promise<TMenuCategory> => {
  const result = await MenuCategory.create(payload);
  return result;
};
const findAllCategory = async (query: { [key: string]: any }) => {
  const result = await MenuCategory.find(query);

  return result;
};
const getSingleCategory = async (id: string) => {
  const result = await MenuCategory.findById(id);
  return result;
};
const updateMenuCategory = async (
  id: string,
  payload: Partial<TMenuCategory>
) => {
  const result = await MenuCategory.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const menuCategoryServices = {
  insertMenuCategoryIntoDb,
  findAllCategory,
  updateMenuCategory,
  getSingleCategory,
};
