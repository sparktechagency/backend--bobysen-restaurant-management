"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.coinWithDrawServices = exports.coinService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const coins_model_1 = __importStar(require("./coins.model"));
// coin service
const getAllMyCoin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coins_model_1.Coin.findOne({ customer: id });
    return result;
});
const insertCoinWithDrawRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        const result = yield coins_model_1.default.create([payload], { session });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Something went wrong.please try again");
        }
        yield coins_model_1.Coin.findOneAndUpdate({ customer: payload.customer }, {
            $inc: {
                coins: Number(-payload.coins),
            },
        }, { new: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
const getAllCoinsWithdrawRequests = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coins_model_1.default.find(query).populate({
        path: "customer",
        select: "fullName email image phoneNumber",
    });
    return result;
});
const getSingleCoinsWithdrawRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coins_model_1.default.findById(id);
    return result;
});
const updateCoinsWithdrawRequest = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, payload);
    const result = yield coins_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.coinService = {
    getAllMyCoin,
};
exports.coinWithDrawServices = {
    insertCoinWithDrawRequest,
    getAllCoinsWithdrawRequests,
    getSingleCoinsWithdrawRequest,
    updateCoinsWithdrawRequest,
};
