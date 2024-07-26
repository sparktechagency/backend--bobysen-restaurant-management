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
exports.menuCategoryServices = void 0;
const menuCategory_model_1 = require("./menuCategory.model");
const insertMenuCategoryIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menuCategory_model_1.MenuCategory.create(payload);
    return result;
});
const findAllCategory = (query) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(query);
    const result = yield menuCategory_model_1.MenuCategory.find(query);
    console.log(result);
    return result;
});
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menuCategory_model_1.MenuCategory.findById(id);
    return result;
});
const updateMenuCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menuCategory_model_1.MenuCategory.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.menuCategoryServices = {
    insertMenuCategoryIntoDb,
    findAllCategory,
    updateMenuCategory,
    getSingleCategory,
};
