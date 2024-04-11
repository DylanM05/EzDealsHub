import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  styled,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useNavigate } from "react-router-dom";

const CreateProduct = ({ user }) => {
  const navigate = useNavigate();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    productImage: null,
  });
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setProductData({ ...productData, productImage: imageFile });
    setSelectedFileName(imageFile ? imageFile.name : "");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedData = sessionStorage.getItem("jwt");
      let token, userId;

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        token = parsedData.token;
        userId = parsedData.user._id;
      } else {
        console.error("Token or User ID is not defined. Redirecting to login.");
        return null;
      }

      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("quantity", productData.quantity);
      formData.append("category", productData.category);
      formData.append("productImage", productData.productImage);

      const response = await axios.post("/api/product/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/products");

      console.log(response.data);
    } catch (error) {
      console.error("Error creating product:", error.message);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <Container
      component="main"
      style={{ width: "600px" }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "white",
          padding: 2,
        }}>
        <Typography
          component="h1"
          variant="h5">
          Create Product
        </Typography>
        <form
          onSubmit={handleFormSubmit}
          style={{ width: "100%", marginTop: "1em" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            inputProps={{ maxLength: 80 }}
            value={productData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="quantity"
            label="Quantity"
            name="quantity"
            type="number"
            value={productData.quantity}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="category"
            label="Category"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
          />
          <Button
            component="label"
            variant="contained"
            startIcon={<AddAPhotoIcon />}>
            {selectedFileName ? `File: ${selectedFileName}` : "Upload image"}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#4a3814", color: "white" }}>
            Create Product
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#4a3814", color: "white" }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateProduct;
