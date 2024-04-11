import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import {
  DeleteForever as DeleteForeverIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  RemoveShoppingCartOutlined as RemoveShoppingCartOutlinedIcon,
} from "@mui/icons-material";
import CheckoutForm from "./CheckoutForm";

const Cart = ({ user }) => {
  const [cart, setCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const tokenData = sessionStorage.getItem("jwt");
        const parsedTokenData = JSON.parse(tokenData);

        if (parsedTokenData && parsedTokenData.token) {
          const token = parsedTokenData.token;
          const response = await axios.get(`/api/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setCart(response.data.products);
        } else {
          console.error("Token not found or invalid format");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [user._id]);

  const removeFromCart = async (productId) => {
    try {
      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;
        await axios.delete(`/api/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCart(cart.filter((item) => item.product._id !== productId));
        document.dispatchEvent(new CustomEvent("cartChanged"));
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  const clearCart = async () => {
    try {
      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;
        await axios.delete(`/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCart([]);
        document.dispatchEvent(new CustomEvent("cartChanged"));
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  return (
    <div>
    <Typography
      variant="h4"
      gutterBottom
      style={{ margin: "0 auto 15px auto", textAlign: "center" }}
    >
      {!isCheckingOut ? "YOUR CART" : "CHECKOUT"}
    </Typography>

    {isCheckingOut ? (
      <CheckoutForm
        user={user}
        cart={cart}
        setIsCheckingOut={setIsCheckingOut}
        clearCart={clearCart}
      />
    ) : (
        <TableContainer
          component={Paper}
          style={{ width: "800px", margin: "auto", padding: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price per Item</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.product._id}>
                  <TableCell
                    component="th"
                    scope="row">
                    <div>
                      <img
                        src={`/images/products/${item.product.image}`}
                        alt={item.product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "10px",
                        }}
                      />
                      {item.product.name}
                    </div>
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    ${item.product.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="secondary"
                      onClick={() => removeFromCart(item.product._id)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
            <div style={{ textAlign: "center", marginTop: "30px", marginBottom:"15px" }}>
              <Button disabled={cart.length < 1}
                variant="outlined"
                startIcon={<RemoveShoppingCartOutlinedIcon />}
                onClick={clearCart}
                style={{ marginRight: "10px" }}
              >
                Clear Cart
              </Button>
              <Button disabled={cart.length < 1}
                variant="contained"
                endIcon={<ShoppingCartCheckoutIcon />}
                onClick={() => setIsCheckingOut(true)}
              >
                Checkout
              </Button>
            </div>
            </TableContainer>
            )}
            </div>
  );
};

export default Cart;
