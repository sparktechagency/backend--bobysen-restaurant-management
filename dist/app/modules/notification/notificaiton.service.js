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
exports.notificationServices = void 0;
const moment_1 = __importDefault(require("moment"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const socket_1 = require("../../utils/socket");
const notification_model_1 = require("./notification.model");
const insertNotificationIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const result = yield notification_model_1.Notification.insertMany(payload);
    // @ts-ignore
    payload === null || payload === void 0 ? void 0 : payload.forEach((element) => {
        (0, socket_1.emitMessage)(element === null || element === void 0 ? void 0 : element.receiver, Object.assign(Object.assign({}, element), { createdAt: (0, moment_1.default)().format("YYYY-MM-DD") }));
    });
    return result;
});
const getAllNotifications = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationModel = new QueryBuilder_1.default(notification_model_1.Notification.find(), query)
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield notificationModel.modelQuery;
    const meta = yield notificationModel.countTotal();
    return {
        data,
        meta,
    };
});
const markAsDone = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.updateMany({ receiver: id }, {
        $set: {
            read: true,
        },
    }, { new: true });
    return result;
});
exports.notificationServices = {
    insertNotificationIntoDb,
    getAllNotifications,
    markAsDone,
};
