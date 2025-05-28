"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Category name is required" }).min(1),
        isActive: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
const updateCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        isActive: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
const getCategoryValidation = {
    createCategoryValidation,
    updateCategoryValidation,
};
exports.default = getCategoryValidation;
