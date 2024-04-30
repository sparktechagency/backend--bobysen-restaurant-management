import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { cartControllers } from "./cart.controller";

const router = Router();
router.post("/:id", auth(USER_ROLE.user), cartControllers.insertItemIntoCart);

export const cartRoutes = router;
