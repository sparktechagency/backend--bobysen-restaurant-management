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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    // userName: {
    //   type: String,
    //   required: [true, "userName is required"],
    // },
    fullName: {
        type: String,
        required: [true, "fullName is required"],
    },
    image: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: [true, "email is required"],
        // unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: 0,
    },
    passwordChangedAt: {
        type: Date,
    },
    needsPasswordChange: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["admin", "vendor", "user"],
    },
    status: {
        type: String,
        enum: user_constant_1.UserStatus,
        default: "active",
    },
    type: {
        type: String,
        enum: ["website_mobile", "widget"],
        default: "website_mobile",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    coin: {
        type: Number,
        default: 0,
    },
    countryCode: {
        type: String,
        required: [true, "countryCode is required"],
        default: "MU",
    },
    phoneNumber: {
        type: String,
        required: [true, "phoneNumber is required"],
    },
    verification: {
        otp: {
            type: String,
            select: 0,
        },
        expiresAt: {
            type: Date,
            select: 0,
        },
        status: {
            type: Boolean,
            default: false,
            select: 0,
        },
    },
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// set '' after saving password
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
// filter out deleted documents
userSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
userSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select("+password");
    });
};
userSchema.statics.IsUserExistbyId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id).select("+password");
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
exports.User = (0, mongoose_1.model)("User", userSchema);
