import express from 'express';
import userRoutes from './user.routes';
import shopRoutes from './shop.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';

const router = express.Router();

//this is /api endpoint, send 404 to not expose it
router.get("/", (req, res) => {
  res.status(404).send("Not Found");
});

//send request to appropriate /api/* endpoint
router.use("/user", userRoutes);
router.use("/shops", shopRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;