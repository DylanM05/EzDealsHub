import express from "express";
import { Router } from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import multerUpload from "../multer";

const router = Router();

router.param("userId", userCtrl.userByID);

router.post("/register", userCtrl.createUser);
router.delete(
  "/delete/:userId",
  authCtrl.requireLogin,
  authCtrl.hasAuthorization,
  userCtrl.deleteUser
);
router.post("/login", authCtrl.login);
router.get("/logout", authCtrl.logout);
router.get("/list", userCtrl.listUsers);
router.get(
  "/:userId",
  authCtrl.requireLogin,
  authCtrl.authToken,
  authCtrl.hasAuthorization,
  userCtrl.fetchUser
);
router.put(
  "/:userId",
  authCtrl.requireLogin,
  authCtrl.authToken,
  authCtrl.hasAuthorization,
  userCtrl.updateUser
);
router.post(
  "/upload-avatar/:userId",
  authCtrl.requireLogin,
  authCtrl.authToken,
  authCtrl.hasAuthorization,
  multerUpload.single("avatar"),
  userCtrl.uploadAvatar
);
router.post(
  "/update-password/:userId",
  authCtrl.requireLogin,
  authCtrl.authToken,
  authCtrl.hasAuthorization,
  userCtrl.updatePassword
);

export default router;
