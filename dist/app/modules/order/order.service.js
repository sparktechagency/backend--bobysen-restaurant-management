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
exports.orderServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = require("../cart/cart.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const wallet_model_1 = require("../wallet/wallet.model");
const axios_1 = __importDefault(require("axios"));
const insertOrderIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart, amount, id_order, status, id_form, checksum } = payload || {};
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
                    date: new Date(),
                    orderId: id_order,
                    status,
                    id_form,
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
    const obj = {
        authentify: {
            id_merchant: "5s0aOiRIH43yqkffzpEbpddlqGzMCoyY",
            id_entity: "w3QAeoMtLJROmlIyXVgnx1R6y7BgNo8t",
            id_operator: "oeRH43c5RoQockXajPTo0TA5YW0KReio",
            operator_password: "NUvxccs0R0rzKPoLlIPeet21rarpX0rk",
        },
        salt: "SQt1DtGZceeCjO59cDAL82sAQcyj8uxocTxMkLeC6mzvfjILIq",
        cipher_key: "aAUJIcMPgVpK9zAB9tVjDWLIglibzgerTeiSU1ACEgu2GXIl1mYMj0wVNjs9XUEdIEysG2G7GNAxYpaGpqveDgVMaNzVZsHNrNdZ",
        received_crypted_data: received_crypted_data,
    };
    try {
        const response = yield axios_1.default.post("https://api.mips.mu/api/decrypt_imn_data", obj, {
            headers: {
                Authorization: "Basic " +
                    Buffer.from("datamation_8a9ft5:kqK1hvT5Mhwu7t0KavYaJctDW5M8xruW").toString("base64"),
                "Content-Type": "application/json",
            },
        });
        console.log("Decrypted data:", response.data);
        // Handle the decrypted data as needed
    }
    catch (error) {
        console.error("Error:", error);
        // Handle the error
    }
});
exports.orderServices = {
    insertOrderIntoDb,
    getImnCallback,
};
