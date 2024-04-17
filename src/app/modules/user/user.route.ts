import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";
import fileUpload from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
const upload = fileUpload("./public/uploads/profile/");
const router = Router();
router.post(
  "/create-user",
  upload.single("file"),
  parseData(),
  userControllers.insertuserIntoDb
);
router.post(
  "/create-vendor",
  upload.single("file"),
  parseData(),
  userControllers.insertVendorIntoDb
);
router.get("/", auth(USER_ROLE.user), userControllers.getme);
router.patch(
  "/",
  auth(USER_ROLE.user),
  upload.single("file"),
  parseData(),
  userControllers.updateProfile
);
export const userRoutes = router;
