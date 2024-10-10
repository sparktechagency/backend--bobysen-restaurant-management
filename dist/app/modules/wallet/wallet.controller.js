"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const wallet_service_1 = require("./wallet.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_constant_1 = require("../user/user.constant");
const sentAmountToTheVendor = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_service_1.walletServices.sendAmountToVendor(
      req.params.id,
      req.body
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Payment Send successfully",
      data: result,
    });
  })
);
const getWalletDetails = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = Object.assign({}, req.query);
    const { role, userId } = req === null || req === void 0 ? void 0 : req.user;
    if (role === user_constant_1.USER_ROLE.vendor) {
      query["owner"] = userId;
    }
    console.log(query);
    const result = yield wallet_service_1.walletServices.getAllWalletDetails(
      query
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Wallet details retrieved successfully",
      data: result === null || result === void 0 ? void 0 : result.data,
      meta: result === null || result === void 0 ? void 0 : result.meta,
    });
  })
);
const getwalletDetailsByOwner = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const result =
      yield wallet_service_1.walletServices.getWalletDetailsByOwner(req.query);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Wallet details retrieved successfully",
      data: result,
    });
  })
);
const getSingleWallet = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_service_1.walletServices.getSingleWallet(
      req.params.id
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Wallet details retrieved successfully",
      data: result,
    });
  })
);
const getWalletStatics = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_service_1.walletServices.getWalletStatics();
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Wallet details retrieved successfully",
      data: result,
    });
  })
);
exports.walletControllers = {
  sentAmountToTheVendor,
  getWalletDetails,
  getwalletDetailsByOwner,
  getSingleWallet,
  getWalletStatics,
};
