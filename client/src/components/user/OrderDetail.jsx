import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Box,
  Divider,
  Grid,
} from "@mui/material";

import Logo from "/assets/images/logo.png";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const tokenData = sessionStorage.getItem("jwt");
        const parsedTokenData = JSON.parse(tokenData);

        if (parsedTokenData && parsedTokenData.token) {
          const token = parsedTokenData.token;
          const response = await axios.get(`/api/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setOrder(response.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const obfuscatedCardNumber = () => {
    if (!order.paymentInfo.cardNumber) {
      return "";
    }
    return order.paymentInfo.cardNumber.replace(/\d(?=\d{4})/g, "*");
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: "20px", margin: "auto", width: "80%" }}>
      <Box
        display="flex"
        justifyContent="space-between">
        <img
          src={Logo}
          alt="Logo"
          style={{ height: "150px", marginBottom: "20px" }}
        />
        <Typography
          variant="h4"
          gutterBottom>
          Invoice
        </Typography>
      </Box>

      {/* Order Information */}
      <Box
        display="flex"
        justifyContent="space-between">
        <Typography
          variant="h6"
          gutterBottom>
          Order ID: {order._id}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom>
          Order Date: {new Date(order.orderDate).toDateString()}
        </Typography>
      </Box>

      <Divider />

      <Grid
        container
        spacing={2}>
        {/* Billing Information */}
        <Grid
          item
          xs={12}
          md={6}>
          <Typography
            variant="h6"
            gutterBottom>
            Billing Information
          </Typography>
          <Typography>
            Street: {order.billingAddress.street}
            <br />
            City: {order.billingAddress.city}
            <br />
            Province: {order.billingAddress.province}
            <br />
            Postal Code: {order.billingAddress.postalcode}
          </Typography>
        </Grid>

        {/* Shipping Information */}
        <Grid
          item
          xs={12}
          md={6}>
          <Typography
            variant="h6"
            gutterBottom>
            Shipping Information
          </Typography>
          <Typography>
            Street: {order.shippingAddress.street}
            <br />
            City: {order.shippingAddress.city}
            <br />
            Province: {order.shippingAddress.province}
            <br />
            Postal Code: {order.shippingAddress.postalcode}
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      {/* Product List */}
      <Typography
        variant="h6"
        gutterBottom>
        Products Ordered
      </Typography>
      <List>
        {order.products.map((orderItem, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar
                variant="square"
                src={`/images/products/${orderItem.product.image}`}
                alt={orderItem.product.name}
                sx={{ width: 100, height: 100, mr: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${orderItem.product.name}`}
              secondary={`Price: $${orderItem.product.price.toFixed(
                2
              )}, Quantity: ${orderItem.quantity}`}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box
        display="flex"
        justifyContent="space-between">
        {/* Payment Information */}
        <Box>
          <Typography
            variant="h6"
            gutterBottom>
            Payment Information
          </Typography>
          <Typography>
            {!order.paymentInfo.method ? (
              <>
                Card Name: {order.paymentInfo.cardName}
                <br />
                Card Number: {obfuscatedCardNumber()}
                <br />
                Expiry Date: {order.paymentInfo.expiryDate}
              </>
            ) : (
              "In-Store Pickup"
            )}
          </Typography>
        </Box>

        {/* Costs Summary */}
        <Box>
          <Typography
            variant="h6"
            gutterBottom>
            Order Total: ${calculateTotal(order.products)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const calculateTotal = (products) => {
  return products
    .reduce((total, orderItem) => {
      return total + orderItem.product.price * orderItem.quantity;
    }, 0)
    .toFixed(2);
};

export default OrderDetail;
