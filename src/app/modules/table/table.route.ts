import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { tableControllers } from "./table.controller";
const router = Router();
router.post("/", auth(USER_ROLE.vendor), tableControllers.insertTableIntoDb);
router.get(
  "/",
  auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
  tableControllers.getAllTables
);
router.get(
  "/:id",
  auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
  tableControllers.getSingleTable
);
export const tableRoutes = router;
