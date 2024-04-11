import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Tooltip,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  styled,
} from "@mui/material";
import {
  AddShoppingCart,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddAPhoto as AddAPhotoIcon,
} from "@mui/icons-material/";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProductList = ({ user, isAuthenticated }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [editProduct, setEditProduct] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [showMyProducts, setShowMyProducts] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const filteredProducts = showMyProducts
    ? products.filter(
        (product) =>
          product.createdBy &&
          user &&
          product.createdBy.username === user.username
      )
    : products;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product/list");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditDialogClose = () => {
    setEditProduct(null);
    setIsEditDialogOpen(false);
  };

  const handleErrorDialogClose = () => {
    setIsErrorDialogOpen(false);
  };

  const handleEditClick = (product, e) => {
    e.stopPropagation();
    setEditProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleShowMyProducts = () => {
    setShowMyProducts(true);
  };

  const handleShowAllProducts = () => {
    setShowMyProducts(false);
  };

  const handleProductClick = (productId, e) => {
    navigate(`/productdetails/${productId}`);
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();

    const product = filteredProducts.find((p) => p._id === productId);

    if (product.quantity === 0) {
      setError("Product is sold out. Cannot add to cart.");
      setIsErrorDialogOpen(true);
      return;
    }

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
      setError("Error adding product to cart. Please try again.");
      setIsErrorDialogOpen(true);
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
        Shop Products
        {isAuthenticated && (
          <>
            {showMyProducts && (
              <Button
                component={Link}
                to="/newproduct"
                variant="contained"
                color="primary"
                style={{ marginLeft: "16px" }}>
                Add a Product
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: "16px" }}
              onClick={handleShowMyProducts}>
              My Products
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "16px" }}
              onClick={handleShowAllProducts}>
              Show All Products
            </Button>
          </>
        )}
      </Typography>
      <Grid
        container
        spacing={3}>
        {filteredProducts.map((product) => (
          <Grid
            item
            key={product._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}>
            <div
              onClick={(e) => handleProductClick(product._id, e)}
              style={{ textDecoration: "none", cursor: "pointer" }}>
              <Card
                variant="outlined"
                style={{ height: "550px", width: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    gutterBottom>
                    {product.name}
                  </Typography>
                  <CardMedia
                    component="img"
                    image={
                      product.image
                        ? `images/products/${product.image}`
                        : "https://placehold.co/200"
                    }
                    alt="Product Image"
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    style={{ margin: "10px auto 5px" }}>
                    {product.description}
                  </Typography>
                  <Divider style={{ margin: "8px 0" }} />
                  <Typography
                    variant="body2"
                    color="textSecondary">
                    Price: ${product.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary">
                    Quantity: {product.quantity}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary">
                    Category: {product.category}
                  </Typography>
                  {product.createdBy && (
                    <Typography
                      variant="body2"
                      color="textSecondary">
                      Owner: {product.createdBy.username}
                    </Typography>
                  )}
                </CardContent>
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
                  {user && isAuthenticated && (
                    <div style={{ display: "flex", marginTop: "8px" }}>
                      {user &&
                        product.createdBy &&
                        product.createdBy.username === user.username && (
                          <>
                            <Tooltip
                              title="Edit Product"
                              arrow>
                              <IconButton
                                onClick={(e) => handleEditClick(product, e)}>
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
                      {product.quantity > 0 && (
                        <Tooltip
                          title="Add to Cart"
                          arrow>
                          <IconButton
                            onClick={(e) => handleAddToCart(product._id, e)}>
                            <AddShoppingCart />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  )}
                </CardActions>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}>
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
          <Button
            component="label"
            variant="contained"
            startIcon={<AddAPhotoIcon />}>
            {selectedFileName ? `File: ${selectedFileName}` : "Upload image"}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={(e) => {
                setEditProduct({ ...editProduct, image: e.target.files[0] });
                setSelectedFileName(
                  e.target.files[0] ? e.target.files[0].name : ""
                );
              }}
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
            onClick={handleUpdateProduct}
            color="secondary"
            variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isErrorDialogOpen}
        onClose={handleErrorDialogClose}>
        <DialogTitle>OUT OF STOCK</DialogTitle>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorDialogClose}
            variant="contained"
            color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

ProductList.propTypes = {
  user: PropTypes.object,
};

export default ProductList;
