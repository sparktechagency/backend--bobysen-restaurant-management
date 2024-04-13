import QueryBuilder from "../../builder/QueryBuilder";
import { TMenu } from "./menu.inteface";
import { Menu } from "./menu.model";

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
// update restaurant here

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
export const menuServices = {
  insertMenuIntoDb,
  getAllMenu,
  getSingleMenu,
  deleteMenu,
};
