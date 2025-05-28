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
exports.orderServices = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const booking_model_1 = require("../booking/booking.model");
const cart_model_1 = require("../cart/cart.model");
const event_service_1 = require("../event/event.service");
const wallet_model_1 = require("../wallet/wallet.model");
const insertOrderIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart, amount: orderAmount, id_order, status, transaction_id, checksum, date, } = payload || {};
    const amount = Number(orderAmount) / 100;
    // console.log("payload from load payment zone", payload);
    //   const formatedAmount = Number(amount) / 100;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // update due
        const updateDue = yield cart_model_1.Cart.findByIdAndUpdate(cart, {
            $inc: {
                totalDue: -Number(amount),
                totalPaid: Number(amount),
            },
            $set: {
                status: "paid",
            },
            $push: {
                transactions: {
                    amount,
                    date,
                    orderId: id_order,
                    status,
                    transaction_id,
                    checksum,
                },
            },
        }, { session, new: true });
        if (!updateDue) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update Data");
        }
        const result = yield wallet_model_1.Wallet.findOneAndUpdate({ owner: updateDue === null || updateDue === void 0 ? void 0 : updateDue.owner }, {
            $inc: {
                amount: Number(amount),
                due: Number(amount),
            },
        }, { upsert: true, new: true, session });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Something went wrong");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
const getImnCallback = (received_crypted_data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let response;
    const obj = {
        authentify: {
            id_merchant: config_1.default.payment.id_merchant,
            id_entity: config_1.default.payment.id_entity,
            id_operator: config_1.default.payment.id_operator,
            operator_password: config_1.default.payment.operator_password,
        },
        salt: config_1.default.payment.salt,
        cipher_key: config_1.default.payment.chiper_key,
        received_crypted_data: received_crypted_data === null || received_crypted_data === void 0 ? void 0 : received_crypted_data.crypted_callback,
    };
    try {
        response = yield axios_1.default.post("https://api.mips.mu/api/decrypt_imn_data", obj, {
            headers: {
                Authorization: "Basic " +
                    Buffer.from("datamation_8a9ft5:kqK1hvT5Mhwu7t0KavYaJctDW5M8xruW").toString("base64"),
                "Content-Type": "application/json",
            },
        });
        // check valid user for using token
        if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.status) !== "SUCCESS") {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "The transactions is failed. please contact to the customer portal.");
        }
        // check try catch
        const additional_param = JSON.parse((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.additional_param);
        const { token, type } = additional_param;
        let decode;
        try {
            decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (err) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "unauthorized");
        }
        const { amount, checksum, id_order, transaction_id, payment_date } = response === null || response === void 0 ? void 0 : response.data;
        if (type === "order") {
            yield insertOrderIntoDb({
                amount,
                checksum,
                id_order,
                transaction_id,
                date: payment_date,
                cart: additional_param === null || additional_param === void 0 ? void 0 : additional_param.cart,
            });
        }
        else if (type === "event") {
            const bookingData = yield booking_model_1.Unpaidbooking.findById(additional_param === null || additional_param === void 0 ? void 0 : additional_param.unpaidBooking);
            const data = Object.assign(Object.assign({}, bookingData === null || bookingData === void 0 ? void 0 : bookingData.toObject()), { transactionId: transaction_id, amount: amount });
            yield event_service_1.eventsServices.makePaymentForEvent(data);
        }
    }
    catch (error) {
        throw new Error(error);
        // Handle the error
    }
    return response === null || response === void 0 ? void 0 : response.data;
});
// load payment zone
const loadPaymentZone = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cart, user } = payload, others = __rest(payload, ["cart", "user"]);
    const data = Object.assign(Object.assign({}, others), { additional_params: [
            {
                param_name: "token",
                param_value: token,
            },
            {
                param_name: "user",
                param_value: payload === null || payload === void 0 ? void 0 : payload.user,
            },
            {
                param_name: "cart",
                param_value: cart,
            },
            {
                param_name: "type",
                param_value: "order",
            },
        ], request_mode: "simple", touchpoint: "native_app" });
    let response;
    const headers = {
        "content-type": "application/json",
        Authorization: "Basic " +
            Buffer.from("datamation_8a9ft5:kqK1hvT5Mhwu7t0KavYaJctDW5M8xruW").toString("base64"),
    };
    const authObj = {
        authentify: {
            id_merchant: config_1.default.payment.id_merchant,
            id_entity: config_1.default.payment.id_entity,
            id_operator: config_1.default.payment.id_operator,
            operator_password: config_1.default.payment.operator_password,
        },
    };
    try {
        response = yield axios_1.default.post(config_1.default.payment.load_payment_zone, Object.assign(Object.assign({}, authObj), data), {
            headers: headers,
        });
        // Handle the response data as needed
    }
    catch (error) {
        throw new Error(error);
        // Handle the error
    }
    return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.answer;
});
exports.orderServices = {
    insertOrderIntoDb,
    getImnCallback,
    loadPaymentZone,
};
