"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderUtils = void 0;
const generateOrderId = () => {
    // Get the current timestamp in milliseconds
    const timestamp = Date.now(); // Current timestamp
    // Generate a random number between 0 and 9999
    const randomNumber = Math.floor(Math.random() * 10000); // Range 0-9999
    // Combine timestamp and random number, and ensure it is 8 digits
    // Use timestamp modulo to keep it within 8 digits
    const orderId = (timestamp % 100000000 + randomNumber).toString().padStart(8, '0').slice(-8);
    return `bookatable-${orderId}`;
};
exports.orderUtils = {
    generateOrderId
};
