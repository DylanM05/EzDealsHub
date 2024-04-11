import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    console.error("Invalid product data:", product);
    return <div>Error loading product details</div>;
  }

  const imageUrl = product.image
    ? `/images/products/${product.image}`
    : "https://placehold.co/200";

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
        lg={4}
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
            {product.name}
          </Typography>
          <CardMedia
            component="img"
            style={{
              width: "90%",
              objectFit: "contain",
              margin: "20px auto 10px auto",
              padding: "10px",
              border: "1px solid #ccc",
            }}
            image={imageUrl}
            alt={product.name}
            onError={(e) => {
              console.error("Error loading image:", e);
            }}
          />
          <CardContent
            style={{
              padding: "10px",
              width: "90%",
              border: "1px solid #ccc",
              margin: "20px auto 10px auto",
            }}>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ padding: "10px", width: "100%" }}>
              {product.description}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ paddingLeft: "10px", width: "100%" }}>
              Price: ${product.price}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ paddingLeft: "10px", width: "100%" }}>
              Quantity: {product.quantity}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ paddingLeft: "10px", width: "100%" }}>
              Category: {product.category}
            </Typography>
            <div>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCancel}
                sx={{
                  margin: "30px auto 10px auto",
                  backgroundColor: "#4a3814",
                }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
