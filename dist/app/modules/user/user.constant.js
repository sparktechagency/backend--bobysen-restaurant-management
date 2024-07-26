"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    admin: "admin",
    vendor: "vendor",
    user: "user",
    all: ["admin", "vendor", "user"].join(","),
};
exports.UserStatus = ["pending", "active", "blocked"];
