import express from 'express';
import orderCtrl from '../controllers/order.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.post('/', authCtrl.requireLogin, authCtrl.authToken, orderCtrl.createOrder);
router.get('/', authCtrl.requireLogin, authCtrl.authToken, orderCtrl.getOrders);
router.get('/:orderId', authCtrl.requireLogin, authCtrl.authToken, orderCtrl.getOrderDetails);

export default router;