import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  TextareaAutosize,
  styled,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const CreateShop = ({ user }) => {
  const navigate = useNavigate();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [shopData, setShopData] = useState({
    name: "",
    description: "",
    image: null,
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
    setShopData({ ...shopData, [name]: value });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setShopData({ ...shopData, image: imageFile });
    setSelectedFileName(imageFile ? imageFile.name : "");
  };

  const handleCancel = () => {
    navigate("/shops/");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", shopData.name);
    formData.append("description", shopData.description);
    formData.append("shopImage", shopData.image);

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

      formData.append("userId", userId);

      const response = await axios.post("/api/shops/createShop", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newShop = response.data.shop;
      console.log("Successfully created Shop:", newShop);

      const imagePath = newShop.image;
      console.log("Image Path:", imagePath);
      console.log(response.data);

      navigate("/shops/");
    } catch (error) {
      console.error("Error creating shop:", error.message);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      height="100vh"
      sx={{ marginTop: "20px" }}>
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}>
        <Paper
          elevation={3}
          sx={{ padding: 3 }}>
          <Typography
            variant="h5"
            gutterBottom>
            Create Shop
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              id="name"
              name="name"
              value={shopData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Description"
              multiline
              fullWidth
              margin="normal"
              id="description"
              name="description"
              value={shopData.description}
              onChange={handleInputChange}
              inputProps={{ maxLength: 80 }}
              sx={{ marginBottom: "20px" }}
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
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "20px", backgroundColor: "#4a3814" }}>
              Create Shop
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCancel}
              sx={{ marginTop: "10px", backgroundColor: "#4a3814" }}>
              Cancel
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateShop;
