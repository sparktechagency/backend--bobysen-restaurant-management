"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitMessage = void 0;
const server_1 = require("../../server");
const emitMessage = (key, data) => {
    server_1.io.emit(key, data);
};
exports.emitMessage = emitMessage;
