const express = require('express');
const router = express.Router();
import productCtrl from '../controllers/product.controller';
import authCtrl from "../controllers/auth.controller";
import multerUpload from "../multer";


router.post('/add', authCtrl.requireLogin, authCtrl.authToken, multerUpload.single('productImage'), productCtrl.addProduct);
router.get('/list', productCtrl.listAllProducts);
router.get('/:id', productCtrl.getProduct);
router.get('/list/:id', authCtrl.requireLogin, authCtrl.authToken, multerUpload.single('productImage'), productCtrl.getUserProducts);
router.put('/:id', authCtrl.requireLogin, authCtrl.authToken, multerUpload.single('productImage'), productCtrl.updateProduct);
router.delete('/:id', authCtrl.requireLogin, authCtrl.authToken,multerUpload.single('productImage'), productCtrl.deleteProduct);
router.delete('/', authCtrl.requireLogin, authCtrl.authToken, multerUpload.single('productImage'), productCtrl.deleteAllProducts);

module.exports = router;