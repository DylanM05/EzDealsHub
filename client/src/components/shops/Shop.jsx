import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CardActions } from "@mui/material";
import AddShoppingCart from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useNavigate, Link } from "react-router-dom";

const Shop = ({ user }) => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShopEditDialogOpen, setIsShopEditDialogOpen] = useState(false);
  const [isProductEditDialogOpen, setIsProductEditDialogOpen] = useState(false);
  const [editedShop, setEditedShop] = useState({});
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await axios.get(`/api/shops/${shopId}`);
        setShop(response.data);
        setProducts(response.data.products);

        // Fetch details for each product
        const productsDetailsPromises = response.data.products.map(
          async (productId) => {
            const productResponse = await axios.get(
              `/api/product/${productId}`
            );
            return productResponse.data;
          }
        );

        const productsDetails = await Promise.all(productsDetailsPromises);
        setProducts(productsDetails);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  const handleCancel = () => {
    navigate("/shops/");
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

  const handleEditShopClick = () => {
    setIsShopEditDialogOpen(true);
    setEditedShop({
      name: shop.name,
      description: shop.description,
      image: null,
    });
  };

  const handleShopEditDialogClose = () => {
    setIsShopEditDialogOpen(false);
  };

  const handleShopEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedShop((prevShop) => ({
      ...prevShop,
      [name]: value,
    }));
  };

  const handleShopImageChange = (e) => {
    const imageFile = e.target.files[0];
    setEditedShop((prevShop) => ({
      ...prevShop,
      image: imageFile,
    }));
    setSelectedFileName(imageFile ? imageFile.name : "");
  };

  //For updating shop
  const handleShopUpdate = async () => {
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
        await axios.put(`/api/shops/${shopId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch the updated shop details
        const updatedResponse = await axios.get(`/api/shops/${shopId}`);
        setShop(updatedResponse.data);
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error updating shop:", error);
    }

    handleShopEditDialogClose();
  };

  //For deleting shop
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

        navigate("/Shops/");
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  const handleProductEditDialogClose = () => {
    setEditProduct(null);
    setIsProductEditDialogOpen(false);
  };

  const handleProductEditClick = (product, e) => {
    e.stopPropagation();
    setEditProduct(product);
    setIsProductEditDialogOpen(true);
  };

  const handleProductClick = (productId, e) => {
    navigate(`/productdetails/${productId}`);
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();

    try {
      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;
        const response = await axios.post(
          `/api/cart/add`,
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        document.dispatchEvent(new CustomEvent("cartChanged"));
        console.log("Product added to cart:", response.data);
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;

        const formData = new FormData();
        formData.append("name", editProduct.name);
        formData.append("description", editProduct.description);
        formData.append("price", editProduct.price);
        formData.append("quantity", editProduct.quantity);
        formData.append("category", editProduct.category);

        if (editProduct.image) {
          formData.append("productImage", editProduct.image);
        }

        const response = await axios.put(
          `/api/product/${editProduct._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedProductResponse = await axios.get(
          `/api/product/${editProduct._id}`
        );
        const updatedProduct = updatedProductResponse.data;

        setProducts((prevProducts) => {
          const updatedProducts = prevProducts.map((product) => {
            if (product._id === editProduct._id) {
              return updatedProduct;
            }
            return product;
          });
          return updatedProducts;
        });
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }

    handleEditDialogClose();
  };

  const handleDeleteProduct = async (productId, e) => {
    e.stopPropagation();
    try {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );

      if (!shouldDelete) {
        return;
      }

      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;

        await axios.delete(`/api/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts((prevProducts) => {
          const updatedProducts = prevProducts.filter(
            (product) => product._id !== productId
          );
          return updatedProducts;
        });
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!shop || !shop.image || !shop.name || !shop.description) {
    console.error("Invalid shop data:", shop);
    return <div>Error loading shop details</div>;
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      height="100%"
      marginTop="30px">
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={6}
        style={{ padding: "10px" }}>
        <Card>
          <Typography
            variant="h4"
            component="div"
            style={{
              alignItems: "center",
              textAlign: "center",
              margin: "15px auto 10px auto",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}>
            {shop.name}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <CardMedia
              component="img"
              style={{
                width: "95%",
                objectFit: "contain",
                margin: "10px auto 10px auto",
                padding: "10px",
                border: "1px solid #ccc",
                maxHeight: "550px",
              }}
              image={`/images/shops/${shop.image}`}
              alt={shop.name + " image"}
              onError={(e) => {
                console.error("Error loading image:", e);
              }}
            />
          </div>
          <CardContent
            style={{
              padding: "10px",
              width: "95%",
              border: "1px solid #ccc",
              margin: "20px auto 10px auto",
            }}>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ padding: "10px", width: "100%" }}>
              {shop.description}
            </Typography>
            <Grid
              container
              spacing={2}>
              {products.map((product) => (
                <Grid
                  item
                  key={product._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}>
                  <Card
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={(e) => handleProductClick(product._id, e)}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom>
                        {product.name}
                      </Typography>
                      <CardMedia
                        component="img"
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          height: "200px",
                        }}
                        image={`/images/products/${product.image}`}
                        alt={product.name}
                        onError={(e) => {
                          console.error("Error loading image:", e);
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginTop: "10px" }}>
                        {product.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginTop: "10px" }}>
                        Quantity: {product.quantity}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginTop: "10px" }}>
                        Price: ${product.price}
                      </Typography>
                      <CardActions
                        sx={{
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                        }}>
                        {product.quantity === 0 ? (
                          <Typography
                            variant="body2"
                            color="error">
                            SOLD OUT
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            color="success">
                            IN STOCK
                          </Typography>
                        )}
                        {user && (
                          <div style={{ display: "flex", marginTop: "8px" }}>
                            {product.quantity > 0 && (
                              <Tooltip
                                title="Add to Cart"
                                arrow>
                                <IconButton
                                  onClick={(e) =>
                                    handleAddToCart(product._id, e)
                                  }>
                                  <AddShoppingCart />
                                </IconButton>
                              </Tooltip>
                            )}
                            {user &&
                              product.createdBy &&
                              product.createdBy.username === user.username && (
                                <>
                                  <Tooltip
                                    title="Edit Product"
                                    arrow>
                                    <IconButton
                                      onClick={(e) =>
                                        handleProductEditClick(product, e)
                                      }>
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip
                                    title="Delete Product"
                                    arrow>
                                    <IconButton
                                      onClick={(e) =>
                                        handleDeleteProduct(product._id, e)
                                      }>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                          </div>
                        )}
                      </CardActions>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}>
              {shop.owner && user && shop.owner.username === user.username && (
                <>
                  <IconButton
                    onClick={handleEditShopClick}
                    aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <div style={{ width: "50px" }} />
                  <IconButton onClick={(e) => handleShopDelete(shop._id, e)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </div>
            <div>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCancel}
                sx={{ marginTop: "10px", backgroundColor: "#4a3814" }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Dialog
        open={isShopEditDialogOpen}
        onClose={handleShopEditDialogClose}>
        <DialogTitle>Edit Shop</DialogTitle>
        <DialogContent>
          <TextField
            label="Shop Name"
            name="name"
            value={editedShop.name || ""}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleShopEditInputChange}
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
            inputProps={{ maxLength: 80 }}
            onChange={handleShopEditInputChange}
          />
          <Button
            component="label"
            variant="contained"
            startIcon={<AddAPhotoIcon />}>
            {selectedFileName ? `File: ${selectedFileName}` : "Upload image"}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleShopImageChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            component={Link}
            to={`/addproduct/${shopId}`}
            color="primary"
            variant="outlined">
            Add Products
          </Button>
          <Button
            onClick={handleShopEditDialogClose}
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

      <Dialog
        open={isProductEditDialogOpen}
        onClose={handleProductEditDialogClose}>
        <DialogTitle style={{ fontSize: "1.5rem" }}>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            value={editProduct ? editProduct.name : ""}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            value={editProduct ? editProduct.description || "" : ""}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            inputProps={{ maxLength: 80 }}
            onChange={(e) =>
              setEditProduct({ ...editProduct, description: e.target.value })
            }
          />
          <TextField
            label="Price"
            type="number"
            value={editProduct ? editProduct.price || 0 : 0}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                price: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label="Quantity"
            type="number"
            value={editProduct ? editProduct.quantity || 0 : 0}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                quantity: parseInt(e.target.value),
              })
            }
          />
          <TextField
            label="Category"
            value={editProduct ? editProduct.category || "" : ""}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setEditProduct({ ...editProduct, category: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditProduct({ ...editProduct, image: e.target.files[0] })
            }
            style={{
              margin: "16px 0",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleProductEditDialogClose}
            color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProduct}
            color="secondary"
            variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Shop;
