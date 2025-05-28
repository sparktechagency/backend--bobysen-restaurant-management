"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.updateCategory = exports.getSingleCategory = exports.getAllCategories = exports.createCategory = void 0;
const category_model_1 = require("./category.model");
// Create a new category
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.create(payload);
    return result;
});
exports.createCategory = createCategory;
// Get all categories
const getAllCategories = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (query = {}) {
    const categories = yield category_model_1.Category.find(query);
    return categories;
});
exports.getAllCategories = getAllCategories;
// Get single category by id
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(id);
    return category;
});
exports.getSingleCategory = getSingleCategory;
// Update category by id
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    return updated;
});
exports.updateCategory = updateCategory;
exports.categoryService = {
    createCategory: exports.createCategory,
    getAllCategories: exports.getAllCategories,
    getSingleCategory: exports.getSingleCategory,
    updateCategory: exports.updateCategory,
};
