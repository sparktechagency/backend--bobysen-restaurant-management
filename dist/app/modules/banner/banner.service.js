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
exports.bannerservices = void 0;
const banner_model_1 = __importDefault(require("./banner.model"));
const insetBannerIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.default.create(payload);
    return result;
});
const getAllBanner = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.default.find({}).populate({
        path: "restaurant",
        select: "name",
    });
    return result;
});
const deleteBanner = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.default.findByIdAndDelete(id);
    return result;
});
exports.bannerservices = {
    insetBannerIntoDb,
    getAllBanner,
    deleteBanner,
};
