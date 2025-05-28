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
exports.io = exports.client = void 0;
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const whatsapp_web_js_1 = __importDefault(require("whatsapp-web.js"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const socketIo_1 = __importDefault(require("./socketIo"));
const { Client, LocalAuth } = whatsapp_web_js_1.default;
exports.client = new Client({
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new LocalAuth({
        clientId: "clientId",
    }),
});
let server;
exports.io = (0, socketIo_1.default)((0, http_1.createServer)(app_1.default));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            server = app_1.default.listen(Number(config_1.default.port), config_1.default.ip, () => {
                console.log(`app is listening on port ${config_1.default.ip} ${config_1.default.port}`);
            });
            exports.io.listen(Number(config_1.default.socket_port));
            console.log(`Socket is listening on port ${config_1.default.socket_port}`);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function whatSappServe() {
    exports.client.on("qr", (qr) => {
        // Generate and display the QR code in the terminal
        qrcode_terminal_1.default.generate(qr, { small: true });
    });
    exports.client.on("ready", () => {
        console.log("Client is ready!");
    });
    exports.client.on("message", (msg) => {
        if (msg.body === "!ping") {
            msg.reply("pong");
        }
    });
    exports.client.on("disconnected", (reason) => {
        console.log("Client was logged out", reason);
    });
    exports.client.initialize().catch((err) => {
        console.error("Error initializing WhatsApp client", err);
    });
}
// whatSappServe();
main();
process.on("unhandledRejection", (err) => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
});
