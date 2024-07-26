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
exports.calculateEndTime = exports.sendMessageToNumber = exports.generateBookingNumber = void 0;
const moment_1 = __importDefault(require("moment"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const server_1 = require("../../../server");
const generateBookingNumber = () => {
    // Get the current timestamp
    const timestamp = Date.now();
    // Use the last 6 digits of the timestamp
    const seed = timestamp % 1000000;
    // Use the seed to generate a random number
    const randomNumber = Math.floor(seed + Math.random() * (999999 - seed));
    return randomNumber;
};
exports.generateBookingNumber = generateBookingNumber;
const sendMessageToNumber = (number, message, mediaPath // Optional media path parameter
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Format the number to include the country code, if not already
        const formattedNumber = number.includes("@c.us")
            ? number
            : `${number}@c.us`;
        if (mediaPath) {
            // Load the media file
            const media = whatsapp_web_js_1.MessageMedia.fromFilePath(mediaPath);
            yield server_1.client.sendMessage(formattedNumber, media, { caption: message });
            console.log(`Media message sent to ${number}: ${message}`);
        }
        else {
            yield server_1.client.sendMessage(formattedNumber, message);
            console.log(`Message sent to ${number}: ${message}`);
        }
    }
    catch (error) {
        console.error(`Failed to send message to ${number}`, error);
    }
});
exports.sendMessageToNumber = sendMessageToNumber;
const calculateEndTime = (arrivalTime) => (0, moment_1.default)(arrivalTime, "HH:mm").add(2, "hours").format("HH:mm");
exports.calculateEndTime = calculateEndTime;
