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
exports.sendReservationEmail = exports.validateBookingTime = exports.checkRestaurantAvailability = exports.sendWhatsAppMessageToVendors = exports.sendWhatsAppMessageToCustomers = exports.calculateEndTime = exports.generateBookingNumber = void 0;
exports.generateTicketNumber = generateTicketNumber;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const mailSender_1 = require("../../utils/mailSender");
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
// export const sendMessageToNumber = async (
//   number: string,
//   message: string,
//   mediaPath?: string // Optional media path parameter
// ): Promise<void> => {
//   try {
//     // Format the number to include the country code, if not already
//     const formattedNumber = number.includes("@c.us")
//       ? number
//       : `${number}@c.us`;
//     if (mediaPath) {
//       // Load the media file
//       const media = MessageMedia.fromFilePath(mediaPath);
//       await client.sendMessage(formattedNumber, media, { caption: message });
//       console.log(`Media message sent to ${number}: ${message}`);
//     } else {
//       await client.sendMessage(formattedNumber, message);
//       console.log(`Message sent to ${number}: ${message}`);
//     }
//   } catch (error) {
//     console.error(`Failed to send message to ${number}`, error);
//   }
// };
const calculateEndTime = (arrivalTime) => (0, moment_1.default)(arrivalTime, "HH:mm").add(2, "hours").format("HH:mm");
exports.calculateEndTime = calculateEndTime;
const sendWhatsAppMessageToCustomers = (_a) => __awaiter(void 0, [_a], void 0, function* ({ phoneNumbers, mediaUrl, bodyValues, buttonUrl, }) {
    const headers = {
        "Content-Type": "application/json",
        authkey: config_1.default.whatsapp_auth_key,
    };
    // Dynamically create the components object
    const components = {
        header_1: {
            type: "image",
            value: mediaUrl, // Correcting this to use 'value' for the URL as per the API example
        },
    };
    // Add body components (body_1 to body_5) based on bodyValues
    bodyValues.forEach((value, index) => {
        components[`body_${index + 1}`] = {
            type: "text",
            value: value, // Correctly using 'value' for text, as per the example
        };
    });
    // // Button component (if provided)
    // if (buttonUrl) {
    //   components["button_1"] = {
    //     type: "url", // Correctly setting the type to 'url'
    //     value: buttonUrl, // Provide the URL directly here
    //     // Remove 'subtype' as it is not needed for url buttons
    //   };
    // }
    // Payload to send the WhatsApp message
    const payload = {
        integrated_number: config_1.default.whatsapp_sms_number,
        content_type: "template",
        payload: {
            messaging_product: "whatsapp",
            type: "template",
            template: {
                name: "customers", // Template name as per your new template
                language: {
                    code: "en",
                    policy: "deterministic",
                },
                namespace: "06d33021_5517_467f_844e_e967daa782c2", // New namespace
                to_and_components: [
                    {
                        to: phoneNumbers, // List of phone numbers
                        components, // Dynamic components (header_1, body_1 to body_5, button_1)
                    },
                ],
            },
        },
    };
    try {
        // Send the POST request
        const response = yield axios_1.default.post("https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/", payload, { headers });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error sending WhatsApp message:", error);
        throw error;
    }
});
exports.sendWhatsAppMessageToCustomers = sendWhatsAppMessageToCustomers;
const sendWhatsAppMessageToVendors = (_a) => __awaiter(void 0, [_a], void 0, function* ({ phoneNumbers, mediaUrl, bodyValues, }) {
    const headers = {
        "Content-Type": "application/json",
        authkey: config_1.default.whatsapp_auth_key,
    };
    // Dynamically create components
    const components = {
        header_1: {
            type: "image",
            value: mediaUrl,
        },
    };
    // Add body components (body_1 to body_5) based on bodyValues
    bodyValues.forEach((value, index) => {
        components[`body_${index + 1}`] = {
            type: "text",
            value,
        };
    });
    // Payload to send the WhatsApp message
    const payload = {
        integrated_number: config_1.default.whatsapp_sms_number,
        content_type: "template",
        payload: {
            messaging_product: "whatsapp",
            type: "template",
            template: {
                name: "owners", // Template name as per your new template
                language: {
                    code: "en",
                    policy: "deterministic",
                },
                namespace: "06d33021_5517_467f_844e_e967daa782c2", // New namespace
                to_and_components: [
                    {
                        to: phoneNumbers, // List of phone numbers
                        components, // Dynamic components (header_1, body_1 to body_5)
                    },
                ],
            },
        },
    };
    try {
        // Send the POST request
        const response = yield axios_1.default.post("https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/", payload, { headers });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error sending WhatsApp message:", error);
        throw error;
    }
});
exports.sendWhatsAppMessageToVendors = sendWhatsAppMessageToVendors;
// Example usage:
const checkRestaurantAvailability = (restaurant, day, time) => {
    if (!restaurant) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Restaurant not found. Please provide a valid restaurant.");
    }
    const { openingTime, closingTime } = restaurant[day === null || day === void 0 ? void 0 : day.toLocaleLowerCase()];
    if ((0, moment_1.default)(time, "HH:mm").isBefore((0, moment_1.default)(openingTime, "HH:mm")) ||
        (0, moment_1.default)(time, "HH:mm").isAfter((0, moment_1.default)(closingTime, "HH:mm"))) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Restaurant is closed at ${time} on ${day}`);
    }
};
exports.checkRestaurantAvailability = checkRestaurantAvailability;
const validateBookingTime = (restaurant, bookingTime) => {
    var _a, _b;
    const isClosed = bookingTime.isBetween((0, moment_1.default)((_a = restaurant === null || restaurant === void 0 ? void 0 : restaurant.close) === null || _a === void 0 ? void 0 : _a.from), (0, moment_1.default)((_b = restaurant === null || restaurant === void 0 ? void 0 : restaurant.close) === null || _b === void 0 ? void 0 : _b.to), undefined, "[]");
    if (isClosed) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Restaurant is closed during this time. Please select another date.");
    }
};
exports.validateBookingTime = validateBookingTime;
const sendReservationEmail = (templateName, userEmail, subject, emailContext) => __awaiter(void 0, void 0, void 0, function* () {
    const templatePath = path_1.default.resolve(__dirname, `../../../../public.html`);
    fs_1.default.readFile(templatePath, "utf8", (err, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error("Error reading the HTML file:", err);
            return;
        }
        try {
            const template = handlebars_1.default.compile(htmlContent);
            const htmlToSend = template(emailContext);
            // Send the email using your sendEmail utility
            yield (0, mailSender_1.sendEmail)(userEmail, subject, htmlToSend);
            console.log(`Email sent successfully to ${userEmail}`);
        }
        catch (compileError) {
            console.error("Error compiling the email template:", compileError);
        }
    }));
});
exports.sendReservationEmail = sendReservationEmail;
function generateTicketNumber() {
    const timestamp = Date.now().toString(); // Get the current timestamp as a string
    const uniqueTicket = timestamp.slice(-6); // Extract the last 6 digits of the timestamp
    return parseInt(uniqueTicket, 10); // Convert it back to an integer
}
