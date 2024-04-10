import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";
const router = Router();
router.post("/create-user", userControllers.insertuserIntoDb);
router.post("/create-vendor", userControllers.insertVendorIntoDb);
router.get("/", auth(USER_ROLE.all), userControllers.getme);
router.patch("/", auth(USER_ROLE.all), userControllers.updateProfile);

export const userRoutes = router;
