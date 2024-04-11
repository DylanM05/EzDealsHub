import express from 'express';
import cartCtrl from '../controllers/cart.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.get('/', authCtrl.requireLogin, authCtrl.authToken, cartCtrl.getCart);
router.post('/add', authCtrl.requireLogin, authCtrl.authToken, cartCtrl.addToCart);
router.delete('/:productId', authCtrl.requireLogin, authCtrl.authToken, cartCtrl.removeFromCart);
router.delete('/', authCtrl.requireLogin, authCtrl.authToken, cartCtrl.clearCart);

export default router;