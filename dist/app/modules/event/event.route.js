"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRoutes = exports.paymentRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUpload_1 = require("../../middleware/fileUpload");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const user_constant_1 = require("../user/user.constant");
const event_controller_1 = require("./event.controller");
const router = (0, express_1.Router)();
exports.paymentRoutes = (0, express_1.Router)();
router.post("/", fileUpload_1.upload.array("files"), (0, parseData_1.default)(), (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), event_controller_1.eventsController.insertEventsIntoDb);
router.get("/vendor", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), event_controller_1.eventsController.geteventForVendor);
router.get("/", event_controller_1.eventsController.getAllEvents);
router.get("/:id", event_controller_1.eventsController.getSingleEvent);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), event_controller_1.eventsController.updateEvent);
router.post("/load-payment-zone", (0, auth_1.default)(user_constant_1.USER_ROLE.user), event_controller_1.eventsController.loadPaymentZoneForEvent);
router.post("/payment", (0, auth_1.default)(user_constant_1.USER_ROLE.user), event_controller_1.eventsController.loadPaymentZoneForEvent);
exports.paymentRoutes.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), event_controller_1.eventsController.getCustomerEventPayments);
exports.eventsRoutes = router;
