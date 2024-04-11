import Order from "../models/order.model";
import Product from "../models/product.model";

const createOrder = async (req, res) => {
  try {
    const { products, billingAddress, shippingAddress, paymentInfo } = req.body;
    let userId = req.user._id;

    const order = new Order({
      user: userId,
      products,
      billingAddress,
      shippingAddress,
      paymentInfo,
    });

    const savedOrder = await order.save();
    // After order is successfully saved, decrease product quantities
    for (let item of order.products) {
      const product = await Product.findById(item.product);
      product.quantity -= item.quantity;
      await product.save();
    }
    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('products.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { createOrder, getOrders, getOrderDetails };

