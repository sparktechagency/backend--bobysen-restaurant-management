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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteListServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const favoriteList_model_1 = require("./favoriteList.model");
const menu_model_1 = require("../menu/menu.model");
const insertMenuIntoFavouriteList = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    // Check if the menu id exists in the user's favorite list
    const favoriteList = yield favoriteList_model_1.FavoriteList.findOne({ user: payload.user });
    let isFavorite = false;
    if (favoriteList && favoriteList.menu.includes(payload.id)) {
        // If the menu id exists, remove it
        result = yield favoriteList_model_1.FavoriteList.findOneAndUpdate({ user: payload.user }, { $pull: { menu: payload.id } }, { new: true });
        isFavorite = false;
    }
    else {
        // If the menu id doesn't exist, add it
        result = yield favoriteList_model_1.FavoriteList.findOneAndUpdate({ user: payload.user }, { $addToSet: { menu: payload.id } }, { new: true, upsert: true });
        isFavorite = true;
    }
    const data = __rest(result === null || result === void 0 ? void 0 : result.toObject(), []);
    return Object.assign(Object.assign({}, data), { isFavorite });
});
const insertRestaurantIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteList_model_1.FavoriteList.findOneAndUpdate({ user: payload === null || payload === void 0 ? void 0 : payload.user }, {
        $addToSet: {
            restaurants: payload === null || payload === void 0 ? void 0 : payload.id,
        },
        $set: {
            user: payload === null || payload === void 0 ? void 0 : payload.user,
        },
    }, {
        upsert: true,
        new: true,
    });
    return result;
});
const removeMenuFromFavoriteList = (id, menu) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteList_model_1.FavoriteList.findByIdAndUpdate(id, {
        $pull: {
            menu: menu,
        },
    }, { new: true });
    return result;
});
const removeRestaurantFromList = (id, restaurant) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteList_model_1.FavoriteList.findByIdAndUpdate(id, {
        $pull: {
            restaurants: restaurant,
        },
    }, { new: true });
    return result;
});
const getAllDataFromFavoriteList = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const FavoriteModel = new QueryBuilder_1.default(favoriteList_model_1.FavoriteList.find().populate((_a = query === null || query === void 0 ? void 0 : query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")), query)
        .search([])
        .filter()
        .paginate()
        .fields()
        .sort();
    const data = yield FavoriteModel.modelQuery;
    const meta = yield FavoriteModel.countTotal();
    return {
        data,
        meta,
    };
});
const getSingleFavoriteDetailsByMenuId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menu_model_1.Menu.findById(id)
        .populate("restaurant")
        .select("name description avilable restaurant.name image price");
    return result;
});
exports.favoriteListServices = {
    insertMenuIntoFavouriteList,
    insertRestaurantIntoDb,
    getAllDataFromFavoriteList,
    removeMenuFromFavoriteList,
    removeRestaurantFromList,
    getSingleFavoriteDetailsByMenuId,
};
