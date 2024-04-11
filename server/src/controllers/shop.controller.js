import Shop from "../models/shop.model";
import Product from "../models/product.model";
const { ObjectId } = require("mongoose").Types;
import multerUpload from "../multer";

const createShop = async (req, res) => {
  try {
    const { name, description, productIds } = req.body; // Assuming productIds is an array of product ObjectIds
    let userId = req.user._id;

    const imagePath = req.file ? req.file.filename : null;

    const shop = new Shop({
      name,
      description,
      image: imagePath,
      owner: userId,
    });

    try {
      const savedShop = await shop.save();

      // If productIds are provided, associate products with the shop
      if (productIds && productIds.length > 0) {
        await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { createdBy: userId } } // Associate products with the shop owner
        );

        // Update the shop's products field with the provided productIds
        await Shop.findByIdAndUpdate(savedShop._id, {
          $addToSet: { products: { $each: productIds } },
        });
      }

      res.status(201).json({
        message: "Shop successfully created!",
        shop: savedShop,
      });
    } catch (saveError) {
      console.error("MongoDB save error:", saveError.message);
      res.status(500).json({ error: saveError.message });
    }
  } catch (err) {
    console.error("Create shop error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

const listAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .select("name description image")
      .populate("owner", "username");
    return res.json(shops);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const shopByID = async (req, res, next, id) => {
  try {
    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({
        error: "Shop not found",
      });
    }

    req.shop = shop;
    req.profile = shop.owner;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const readShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.shop)
      .select("_id name description image products owner")
      .populate("owner", "username");

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.json(shop);
  } catch (error) {
    console.error("Error reading shop:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const editShop = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if there's a file in the request
    if (req.file) {
      const imagePath = req.file.filename;

      // Update the shop with the new image
      const updateData = {
        name,
        description,
        image: imagePath,
      };

      // Perform the update using updateData
      const updatedShop = await Shop.findByIdAndUpdate(
        req.params.shopId,
        updateData,
        { new: true }
      );

      if (!updatedShop) {
        return res.status(404).json({ error: "Shop not found" });
      }

      // Respond with the updated shop data
      res.json(updatedShop);
    } else {
      // No file included in the update, handle without changing image
      const updateData = {
        name,
        description,
      };

      // Perform the update using updateData
      const updatedShop = await Shop.findByIdAndUpdate(
        req.params.shopId,
        updateData,
        { new: true }
      );

      if (!updatedShop) {
        return res.status(404).json({ error: "Shop not found" });
      }

      // Respond with the updated shop data
      res.json(updatedShop);
    }
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    if (!shop.owner.equals(req.user._id)) {
      return res.status(403).json({
        error: "Shop deletion not authorized",
      });
    }

    await shop.deleteOne();
    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    console.error("Error deleting shop:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addProduct = async (req, res) => {
  try {
    const { shopId, productId } = req.params;

    // Check if the shop exists
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the shop's products field with the existing product's ObjectId
    await Shop.findByIdAndUpdate(shopId, {
      $addToSet: { products: productId },
    });

    res.status(200).json({
      message: "Product successfully added to the shop!",
      productId: productId,
    });
  } catch (err) {
    console.error("Add product to shop error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

export default {
  createShop,
  listAllShops,
  shopByID,
  readShop,
  editShop,
  deleteShop,
  addProduct,
};
