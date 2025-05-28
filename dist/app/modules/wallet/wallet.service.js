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
exports.walletServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const notificaiton_service_1 = require("../notification/notificaiton.service");
const notification_constant_1 = require("../notification/notification.constant");
const notification_interface_1 = require("../notification/notification.interface");
const wallet_constant_1 = require("./wallet.constant");
const wallet_model_1 = require("./wallet.model");
const sendAmountToVendor = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, method, percentage } = payload || {};
    // Calculate the subtotal after discount
    const subTotal = Math.ceil((Number(amount) * (100 - Number(percentage))) / 100);
    // Find the wallet by ID and populate the owner field
    const findWallet = yield wallet_model_1.Wallet.findById(id).populate("owner");
    const date = (0, moment_1.default)().format("YYYY-MM-DD");
    // Condition for insufficient balance
    if (Number(amount) > Number(findWallet === null || findWallet === void 0 ? void 0 : findWallet.due)) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Insufficient balance");
    }
    // Prepare the notification object
    const notification = [
        {
            receiver: (_a = findWallet === null || findWallet === void 0 ? void 0 : findWallet.owner) === null || _a === void 0 ? void 0 : _a._id,
            message: notification_constant_1.messages.payment,
            refference: findWallet === null || findWallet === void 0 ? void 0 : findWallet._id,
            model_type: notification_interface_1.modeType.Wallet,
        },
    ];
    // Update the wallet by decrementing the due amount and incrementing the total paid amount
    const result = yield wallet_model_1.Wallet.findByIdAndUpdate(id, {
        $inc: {
            due: -Number(amount), // Decrease the due amount by the payment amount
            totalPaid: Number(amount), // Increment totalPaid by the actual paid amount
        },
        lastPaymentDate: new Date(),
        $push: {
            paymentHistory: {
                method: method,
                amount: Number(amount),
                date,
                subTotal: subTotal, // Store the discounted amount in payment history
                percentage: Number(percentage),
            },
        },
    }, { new: true });
    // Insert the notification into the database
    yield notificaiton_service_1.notificationServices.insertNotificationIntoDb(notification);
    return result;
});
const getAllWalletDetails = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const walletModel = new QueryBuilder_1.default(wallet_model_1.Wallet.find().populate("owner"), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = yield walletModel.modelQuery;
    const meta = yield walletModel.countTotal();
    return {
        data,
        meta,
    };
});
const getWalletDetailsByOwner = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [];
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
        },
    }, {
        $unwind: "$ownerDetails",
    }, {
        $lookup: {
            from: "restaurants",
            localField: "ownerDetails._id",
            foreignField: "owner",
            as: "restaurantDetails",
        },
    }, {
        $unwind: "$restaurantDetails",
    }, {
        $project: {
            owner: "$ownerDetails.fullName",
            restaurant: "$restaurantDetails.name",
            amount: 1,
            totalPaid: 1,
            due: 1,
            paymentHistory: 1,
        },
    });
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        const searchRegex = new RegExp(query.searchTerm, "i");
        const searchMatchStage = {
            $or: wallet_constant_1.WalletSearchableFields.map((field) => ({
                [field]: { $regex: searchRegex },
            })),
        };
        pipeline.push({ $match: searchMatchStage });
    }
    const result = yield wallet_model_1.Wallet.aggregate(pipeline);
    return result;
});
const getWalletStatics = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_model_1.Wallet.aggregate([
        {
            $group: {
                _id: null, // Group all documents
                totalDue: { $sum: "$due" }, // Calculate total due
                totalPaid: { $sum: "$totalPaid" }, // Calculate total paid
            },
        },
        {
            $project: {
                _id: 0, // Exclude _id field
                totalDue: 1, // Include totalDue
                totalPaid: 1, // Include totalPaid
                totalBalance: { $subtract: ["$totalDue", "$totalPaid"] }, // Calculate total balance (due - totalPaid)
            },
        },
    ]);
    return result[0];
});
const getSingleWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_model_1.Wallet.findById(id);
    return result;
});
exports.walletServices = {
    getAllWalletDetails,
    sendAmountToVendor,
    getWalletDetailsByOwner,
    getWalletStatics,
    getSingleWallet,
};
