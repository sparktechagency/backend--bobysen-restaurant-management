"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const category_controller_1 = require("./category.controller");
const category_validation_1 = __importDefault(require("./category.validation"));
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(category_validation_1.default.createCategoryValidation), (0, auth_1.default)(user_constant_1.USER_ROLE.admin), category_controller_1.categoryController.createCategory);
router.get("/", category_controller_1.categoryController.getAllCategories);
router.get("/:id", category_controller_1.categoryController.getSingleCategory);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(category_validation_1.default.updateCategoryValidation), category_controller_1.categoryController.updateCategory);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), category_controller_1.categoryController.deleteCategory);
exports.categoryRoutes = router;
