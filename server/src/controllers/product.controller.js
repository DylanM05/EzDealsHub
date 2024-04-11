import Product from "../models/product.model";
import mongoose from "mongoose";
import multerUpload from "../multer";
import Shop from "../models/shop.model";

const objectIdFromParams = (paramId) => new mongoose.Types.ObjectId(paramId);

const addProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: req.user._id,
    });
    if (req.file) {
      product.image = req.file.filename;
    }

    await product.save();

    console.log("Product saved successfully:", product);
    return res.status(201).json({
      message: `Product ${product._id} has been added by User ${req.user._id}`,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const listAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select("name description price quantity category image createdBy")
      .populate("createdBy", "username");

    res.json(products);
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = objectIdFromParams(req.params.id);
    const product = await Product.findById(productId);

    if (!product || product.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ error: "Product not found or unauthorized to delete" });
    }

    // Find all shops that reference the product and update them
    const shops = await Shop.find({ products: productId });
    await Promise.all(
      shops.map(async (shop) => {
        shop.products = shop.products.filter(
          (shopProductId) => shopProductId.toString() !== productId.toString()
        );
        await shop.save();
      })
    );

    await product.deleteOne();

    res.json({
      message: `Successfully deleted product with ID: ${productId}`,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const productId = objectIdFromParams(req.params.id);
    const product = await Product.findById(productId)
      .select("name description price quantity category image createdBy")
      .populate("createdBy", "username");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = objectIdFromParams(req.params.id);
    const product = await Product.findById(productId);

    if (!product || product.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ error: "Product not found or unauthorized to update" });
    }
    if (req.file) {
      product.image = req.file.filename;
    }

    product.set(req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({ createdBy: req.user._id });
    return res.json({
      message: "All user-specific products deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting user-specific products:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

const getUserProducts = async (req, res) => {
  try {
    // Authenticate the user using the token
    const userId = req.user._id;

    // You can also add additional checks here if needed

    const products = await Product.find({ createdBy: userId }).select(
      "name description price quantity image category"
    );

    res.json(products);
  } catch (error) {
    console.error("Error getting user products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  addProduct,
  getProduct,
  listAllProducts,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  getUserProducts,
};
