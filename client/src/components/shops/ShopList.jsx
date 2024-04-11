import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material/";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import PropTypes from "prop-types";

const Shops = ({ user, isAuthenticated }) => {
  const [shops, setShops] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedShop, setEditedShop] = useState({});
  const navigate = useNavigate();
  const [showMyShops, setShowMyShops] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const filteredShops = showMyShops
    ? shops.filter(
        (shop) => shop.owner && user && shop.owner.username === user.username
      )
    : shops;

  const handleShopClick = (shopId) => {
    navigate(`/shops/${shopId}`);
  };

  const handleAddProductsClick = (shopId, e) => {
    e.stopPropagation();
    navigate(`/addproduct/${shopId}`);
  };

  const handleEditClick = (shop, e) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
    setEditedShop({
      _id: shop._id,
      name: shop.name,
      description: shop.description,
      image: null,
    });
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedShop((prevShop) => ({
      ...prevShop,
      [name]: value,
    }));
  };

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

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setEditedShop((prevShop) => ({
      ...prevShop,
      image: imageFile,
    }));
    setSelectedFileName(imageFile ? imageFile.name : "");
  };

  //For updating shop
  const handleShopUpdate = async (e) => {
    e.preventDefault();
    try {
      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;

        const formData = new FormData();
        formData.append("name", editedShop.name);
        formData.append("description", editedShop.description);
        formData.append("shopImage", editedShop.image);

        // Perform the update using formData
        await axios.put(`/api/shops/${editedShop._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Fetch the updated shop details
        const updatedResponse = await axios.get(`/api/shops/${editedShop._id}`);
        setShops((prevShops) =>
          prevShops.map((prevShop) =>
            prevShop._id === editedShop._id ? updatedResponse.data : prevShop
          )
        );
      } else {
        console.error("Token not found or invalid format");
      }
      navigate("/shops");
    } catch (error) {
      console.error("Error updating shop:", error);
    }

    handleEditDialogClose();
  };

  const handleShopDelete = async (shopId, e) => {
    e.stopPropagation();
    try {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this shop?"
      );

      if (!shouldDelete) {
        return;
      }

      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;

        await axios.delete(`/api/shops/delete/${shopId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShops((prevShops) => {
          const updatedShops = prevShops.filter((shop) => shop._id !== shopId);
          return updatedShops;
        });
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const endpoint = showMyShops ? "/api/shops/myshops" : "/api/shops/";
        const response = await axios.get(endpoint);
        setShops(response.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, []);

  return (
    <Container
      xs={12}
      sm={8}
      md={6}
      lg={4}
      style={{ height: "100%" }}>
      <Typography
        variant="h4"
        gutterBottom>
        {showMyShops ? "My Shops" : "SHOPS"}
        {isAuthenticated && showMyShops && (
          <Button
            component={Link}
            to="/createShop"
            variant="contained"
            color="primary"
            style={{ marginLeft: "16px" }}>
            Add a Shop
          </Button>
        )}
        {isAuthenticated && (
          <>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "16px" }}
              onClick={() => setShowMyShops(true)}>
              My Shops
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "16px" }}
              onClick={() => setShowMyShops(false)}>
              Show All Shops
            </Button>
          </>
        )}
      </Typography>
      <Grid
        container
        spacing={3}>
        {filteredShops.map((shop) => (
          <Grid
            item
            key={shop._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleShopClick(shop._id)}>
              <Card
                variant="outlined"
                style={{ height: "550px", width: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h7"
                    component="div"
                    gutterBottom
                    style={{ textAlign: "center" }}>
                    {shop.name}
                  </Typography>
                  <CardMedia
                    component="img"
                    image={
                      shop.image
                        ? `/images/shops/${shop.image}`
                        : "https://placehold.co/200"
                    }
                    alt="Shop Image"
                    sx={{
                      width: "100%",
                      height: "250px",
                      objectFit: "contain",
                      margin: "10px auto 10px auto",
                    }}
                    onError={(e) => {
                      console.error("Error loading image:", e);
                    }}
                  />
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    style={{
                      fontSize: "15px",
                      marginTop: "8px",
                      padding: "5px",
                    }}>
                    {shop.description}
                  </Typography>
                  <Divider style={{ margin: "8px 0" }} />
                  {shop.owner && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{
                        fontSize: "14px",
                        marginBottom: "5px",
                        textAlign: "center",
                        overflow: "hidden",
                        maxHeight: `${200}px`,
                      }}>
                      Owner: {shop.owner.username}
                    </Typography>
                  )}
                </CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  {isAuthenticated &&
                    shop.owner &&
                    user &&
                    shop.owner.username === user.username && (
                      <Button
                        color="primary"
                        variant="outlined"
                        style={{ marginBottom: "5px" }}
                        onClick={(e) => handleAddProductsClick(shop._id, e)}>
                        Add Products
                      </Button>
                    )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      gap: "5px",
                      margin: "auto auto 5px auto",
                      width: "fit-content",
                    }}>
                    <div>
                      {shop.owner &&
                        user &&
                        shop.owner.username === user.username && (
                          <>
                            <IconButton
                              onClick={(e) => handleEditClick(shop, e)}>
                              <EditIcon />
                            </IconButton>
                          </>
                        )}
                    </div>
                    <div>
                      {shop.owner &&
                        user &&
                        shop.owner.username === user.username && (
                          <>
                            <IconButton
                              onClick={(e) => handleShopDelete(shop._id, e)}>
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}>
        <DialogTitle>Edit Shop</DialogTitle>
        <DialogContent>
          <TextField
            label="Shop Name"
            name="name"
            value={editedShop.name || ""}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleEditInputChange}
          />
          <TextField
            label="Description"
            name="description"
            value={editedShop.description || ""}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            inputProps={{ maxLength: 120 }}
            onChange={handleEditInputChange}
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditDialogClose}
            color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleShopUpdate}
            color="secondary"
            variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
Shops.propTypes = {
  user: PropTypes.object,
};

export default Shops;
