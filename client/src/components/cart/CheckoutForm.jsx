import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  FormControl,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ user, cart, setIsCheckingOut, clearCart }) => {
  const navigate = useNavigate();
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    province: "",
    postalcode: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    province: "",
    postalcode: "",
  });
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevPaymentInfo) => ({
      ...prevPaymentInfo,
      [name]: value,
    }));
  };
  const [localPickup, setLocalPickup] = useState(false);

  const handleLocalPickupChange = (e) => {
    setLocalPickup(e.target.checked);
  };
  const handleInputChange = (e, setAddress) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setSameAsBilling(e.target.checked);
    if (e.target.checked) {
      setShippingAddress(billingAddress);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const order = {
      products: cart,
      billingAddress,
      shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
      paymentInfo: localPickup ? { method: "Local Pickup" } : paymentInfo,
    };
    try {
      const tokenData = sessionStorage.getItem("jwt");
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.token) {
        const token = parsedTokenData.token;
        const response = await axios.post("/api/orders", order, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        clearCart();
        setIsCheckingOut(false);
        navigate(`/order/${response.data._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container
      component={Paper}
      maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "top",
          }}>
          <FormControl
            component="form"
            noValidate
            sx={{ mt: 1, width: "50%" }}>
            <fieldset>
              <legend>Billing & Shipping Address</legend>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="billingStreet"
                label="Billing Street"
                name="street"
                autoComplete="street"
                autoFocus
                value={billingAddress.street}
                onChange={(e) => handleInputChange(e, setBillingAddress)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="billingCity"
                label="Billing City"
                name="city"
                autoComplete="city"
                value={billingAddress.city}
                onChange={(e) => handleInputChange(e, setBillingAddress)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="billingProvince"
                label="Billing Province"
                name="province"
                autoComplete="province"
                value={billingAddress.province}
                onChange={(e) => handleInputChange(e, setBillingAddress)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="billingPostalCode"
                label="Billing Postal Code"
                name="postalcode"
                autoComplete="postalcode"
                value={billingAddress.postalcode}
                onChange={(e) => handleInputChange(e, setBillingAddress)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="sameAsBilling"
                    color="primary"
                  />
                }
                label="Shipping address same as billing"
                checked={sameAsBilling}
                onChange={handleCheckboxChange}
              />
              {!sameAsBilling && (
                <React.Fragment>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="shippingStreet"
                    label="Shipping Street"
                    name="street"
                    autoComplete="street"
                    value={shippingAddress.street}
                    onChange={(e) => handleInputChange(e, setShippingAddress)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="shippingCity"
                    label="Shipping City"
                    name="city"
                    autoComplete="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange(e, setShippingAddress)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="shippingProvince"
                    label="Shipping Province"
                    name="province"
                    autoComplete="province"
                    value={shippingAddress.province}
                    onChange={(e) => handleInputChange(e, setShippingAddress)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="shippingPostalCode"
                    label="Shipping Postal Code"
                    name="postalcode"
                    autoComplete="postalcode"
                    value={shippingAddress.postalcode}
                    onChange={(e) => handleInputChange(e, setShippingAddress)}
                  />
                </React.Fragment>
              )}
            </fieldset>
          </FormControl>

          <FormControl
            component="form"
            noValidate
            onSubmit={handleFormSubmit}
            sx={{
              width: "50%",
              marginLeft: "1%",
              borderLeft: "1px solid #ccc",
              padding: 2,
            }}>
            <Typography
              component="h2"
              variant="h6">
              Cart Summary
            </Typography>
            {cart.map((item) => (
              <Box
                key={item.product._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                }}>
                <Typography>{item.product.name}</Typography>
                <Typography>
                  ${item.product.price} x {item.quantity} = $
                  {(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography>Total:</Typography>
              <Typography>
                $
                {cart
                  .reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  value="localPickup"
                  color="primary"
                />
              }
              label="Local Pickup with In-Person Payment"
              checked={localPickup}
              onChange={handleLocalPickupChange}
            />

            {!localPickup && (
              <React.Fragment>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="cardName"
                  label="Name on Card"
                  name="cardName"
                  autoComplete="cardName"
                  value={paymentInfo.cardName}
                  onChange={(e) => handlePaymentInputChange(e)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="cardNumber"
                  label="Card Number"
                  name="cardNumber"
                  autoComplete="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handlePaymentInputChange(e)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="expiryDate"
                  label="Expiry Date"
                  name="expiryDate"
                  autoComplete="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => handlePaymentInputChange(e)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="cvv"
                  label="CVV"
                  name="cvv"
                  autoComplete="cvv"
                  value={paymentInfo.cvv}
                  onChange={(e) => handlePaymentInputChange(e)}
                />
              </React.Fragment>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}>
              Place order
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsCheckingOut(false)}>
              Back to Cart
            </Button>
          </FormControl>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutForm;
