import Cart from "../models/cart.model";
import Product from "../models/product.model";

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const productExistsInCart = cart.products.find(
        (p) => p.product.toString() === productId
      );

      if (productExistsInCart) {
        productExistsInCart.quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
    } else {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user: req.user._id,
        products: [{ product: productId, quantity: 1 }],
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.products = [];
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default { getCart, addToCart, removeFromCart,clearCart };
