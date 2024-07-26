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
exports.contentServices = void 0;
const content_model_1 = require("./content.model");
const insertContentIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingContent = yield content_model_1.Content.findOne();
    let result;
    if (existingContent) {
        result = yield content_model_1.Content.findByIdAndUpdate(existingContent._id, payload, {
            new: true,
        });
    }
    else {
        result = yield content_model_1.Content.create(payload);
    }
    return result;
});
const getContents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let selectFields = {};
    // Extract select fields from the query
    if (query.select) {
        const fields = query.select.split(",");
        fields.forEach((field) => {
            selectFields[field.trim()] = 1;
        });
    }
    const result = yield content_model_1.Content.findOne({}, selectFields);
    return result;
});
exports.contentServices = {
    insertContentIntoDb,
    getContents,
};
