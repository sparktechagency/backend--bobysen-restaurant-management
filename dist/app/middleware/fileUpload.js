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
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importStar(require("multer"));
const fileUpload = (folder) => {
    const upload = (0, multer_1.default)({
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 20000000,
        },
        fileFilter: function (req, file, cb) {
            if (file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg" ||
                file.mimetype === "image/svg" ||
                file.mimetype === "image/webp" ||
                file.mimetype === "application/octet-stream" ||
                file.mimetype === "image/svg+xml") {
                cb(null, true);
            }
            else {
                cb(null, false);
                throw new Error("only png,jpg,jpeg,svg format allowed");
            }
        },
    });
    return upload;
};
exports.upload = fileUpload();
exports.default = fileUpload;
//
