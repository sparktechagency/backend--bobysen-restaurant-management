import { Icategory } from "./category.interface";
import { Category } from "./category.model";

// Create a new category
export const createCategory = async (payload: Icategory) => {
  const result = await Category.create(payload);
  return result;
};

// Get all categories
export const getAllCategories = async (query: Record<string, any> = {}) => {
  const categories = await Category.find(query);
  return categories;
};

// Get single category by id
export const getSingleCategory = async (id: string) => {
  const category = await Category.findById(id);
  return category;
};

// Update category by id
export const updateCategory = async (
  id: string,
  payload: Partial<Icategory>
) => {
  const updated = await Category.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

// Delete category by id
export const deleteCategory = async (id: string) => {
  const deleted = await Category.findByIdAndDelete(id);
  return deleted;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
