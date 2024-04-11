import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    switch (file.fieldname) {
      case "avatar":
        uploadPath = "uploads/images/avatars";
        break;
      case "productImage":
        uploadPath = "uploads/images/products";
        break;
      case "shopImage":
        uploadPath = "uploads/images/shops";
        break;
      default:
        uploadPath = "uploads/images/default";
    }

    // Check if the directory exists, create it if not
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    // Replace spaces and special characters with underscores
    const sanitizeFilename = (filename) => filename.replace(/[^\w.-]/g, "_");
    cb(null, `${Date.now()}-${sanitizeFilename(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});

export default multerUpload;
