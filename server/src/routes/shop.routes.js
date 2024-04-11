import { Router } from "express";
import shopCtrl from "../controllers/shop.controller";
import authCtrl from "../controllers/auth.controller";
import userCtrl from "../controllers/user.controller";
import multerUpload from "../multer";

const router = Router();
router.post(
  "/createShop",
  authCtrl.requireLogin,
  authCtrl.authToken,
  multerUpload.single("shopImage"),
  shopCtrl.createShop
);
router.put(
  "/:shopId",
  authCtrl.requireLogin,
  authCtrl.authToken,
  multerUpload.single("shopImage"),
  authCtrl.hasAuthorization,
  shopCtrl.editShop
);
router.delete(
  "/delete/:shopId",
  authCtrl.requireLogin,
  authCtrl.authToken,
  authCtrl.hasAuthorization,
  shopCtrl.deleteShop
);
router.get("/", shopCtrl.listAllShops);
router.get("/:shopId", shopCtrl.shopByID);
router.get("/:shopId", shopCtrl.readShop);
router.put("/:shopId/:productId", shopCtrl.addProduct);

router.param("shopId", shopCtrl.shopByID);
router.param("userId", userCtrl.userByID);

export default router;
