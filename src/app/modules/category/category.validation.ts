import { z } from "zod";

const createCategoryValidation = z.object({
  body: z.object({
    name: z.string({ required_error: "Category name is required" }).min(1),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const getCategoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};

export default getCategoryValidation;
