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
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material/";
import { Link, useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProductList = ({ isAuthenticated, user }) => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [inShopProducts, setInShopProducts] = useState([]);
  const [showMyProducts] = useState(false);
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
        const shopResponse = await axios.get(`/api/shops/${shopId}`);
        const shopData = shopResponse.data;
        setInShopProducts(shopData.products);

        const tokenData = sessionStorage.getItem("jwt");
        const parsedTokenData = JSON.parse(tokenData);

        if (parsedTokenData && parsedTokenData.token) {
          const token = parsedTokenData.token;

          const productsResponse = await axios.get(
            `/api/product/list/${shopId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("API Response:", productsResponse.data);
          setProducts(productsResponse.data);
        } else {
          console.error("Token not found or invalid format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [shopId]);

  const handleProductClick = async (productId, e) => {
    e.stopPropagation();

    try {
      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;

        const response = await axios.put(
          `/api/shops/${shopId}/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Product added to shop:", response.data);

        const updatedShopResponse = await axios.get(`/api/shops/${shopId}`);
        const updatedShopData = updatedShopResponse.data;

        setInShopProducts(updatedShopData.products);
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error adding product to shop:", error);
    }
  };
  const handleDoneClick = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        gutterBottom>
        Add Your products to your Shop
        {isAuthenticated && (
          <>
            <Button
              component={Link}
              to={`/newproduct/${shopId}`}
              variant="contained"
              color="primary"
              style={{ marginLeft: "16px" }}>
              Create a Product
            </Button>
          </>
        )}
        <Button
          onClick={handleDoneClick}
          variant="contained"
          color="primary"
          style={{ marginLeft: "16px" }}>
          Done
        </Button>
      </Typography>
      <Grid
        container
        spacing={3}>
        {filteredProducts?.map((product) => (
          <Grid
            item
            key={product._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}>
            <div style={{ textDecoration: "none", cursor: "pointer" }}>
              <Card variant="outlined">
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
                        ? `/images/products/${product.image}`
                        : "https://placehold.co/200"
                    }
                    alt="Product Image"
                    sx={{ width: "100%", maxHeight: "200px" }}
                  />
                  <Typography
                    color="textSecondary"
                    gutterBottom>
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
                  {inShopProducts.includes(product._id) ? (
                    <Typography
                      variant="body2"
                      color="textSecondary">
                      Product in Shop
                    </Typography>
                  ) : (
                    <IconButton
                      onClick={(e) => handleProductClick(product._id, e)}>
                      <AddIcon />
                    </IconButton>
                  )}
                </CardContent>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

ProductList.propTypes = {
  user: PropTypes.object,
};

export default ProductList;
