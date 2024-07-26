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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const cart_model_1 = require("./cart.model");
const insertItemsIntoCart = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const result = yield cart_model_1.Cart.findOneAndUpdate({
        booking: payload.booking,
    }, Object.assign(Object.assign({}, payload), { $push: { items: payload.item }, $inc: {
            totalAmount: Number(payload.item.amount),
            totalDue: Number(payload.item.amount),
        }, $set: {
            status: "unpaid",
            owner: payload.owner,
        } }), { upsert: true, new: true });
    return result;
});
const getCartItems = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_model_1.Cart.findOne({ booking: id }).populate({
        path: "items.menu",
        model: "Menu",
    });
    return result;
});
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const OrderModel = new QueryBuilder_1.default(cart_model_1.Cart.find().populate("items.menu booking"), query)
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield OrderModel.modelQuery;
    const meta = yield OrderModel.countTotal();
    return {
        data,
        meta,
    };
});
const removeItemFromCart = (id, item) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_model_1.Cart.findOneAndUpdate({ booking: id }, {
        $pull: {
            items: { _id: item === null || item === void 0 ? void 0 : item.itemId },
        },
        $inc: {
            totalAmount: -Number(item === null || item === void 0 ? void 0 : item.amount), // Correcting the negative value
            totalDue: -Number(item === null || item === void 0 ? void 0 : item.amount), // Correcting the negative value
        },
    }, { new: true } // To return the updated document
    );
    return result;
});
const getSingleCartItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_model_1.Cart.findById(id).populate({
        path: "items.menu",
        model: "Menu",
    });
    return result;
});
exports.cartServices = {
    insertItemsIntoCart,
    getCartItems,
    getAllOrders,
    getSingleCartItem,
    removeItemFromCart,
};
