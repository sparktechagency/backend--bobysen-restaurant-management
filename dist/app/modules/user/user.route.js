"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUpload_1 = require("../../middleware/fileUpload");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = require("./user.controller");
const user_utils_1 = require("./user.utils");
const router = (0, express_1.Router)();
router.post('/create-user', user_utils_1.signupLimiter, user_utils_1.validateEmailDomain, 
// verifyCaptchaToken,
// upload.single("file"),
// parseData(),
user_controller_1.userControllers.insertuserIntoDb);
router.post('/create-vendor', fileUpload_1.upload.single('file'), (0, parseData_1.default)(), user_controller_1.userControllers.insertVendorIntoDb);
router.post('/widget/create-user', user_controller_1.userControllers.insertUserIntoDbFromWidget);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), fileUpload_1.upload.single('file'), (0, parseData_1.default)(), user_controller_1.userControllers.updateUser);
router.patch('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.vendor), fileUpload_1.upload.single('file'), (0, parseData_1.default)(), user_controller_1.userControllers.updateProfile);
router.get('/all', (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), user_controller_1.userControllers.getAllUsers);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.vendor), user_controller_1.userControllers.getme);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.getsingleUser);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), fileUpload_1.upload.single('file'), (0, parseData_1.default)(), user_controller_1.userControllers.updateUser);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user), fileUpload_1.upload.single('file'), (0, parseData_1.default)(), user_controller_1.userControllers.updateProfile);
router.delete('/', (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.user), user_controller_1.userControllers.deleteAccount);
exports.userRoutes = router;
