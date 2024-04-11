import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";
import PropTypes from "prop-types";

const Register = ({ onSuccessfulSignup }) => {
  const navigate = useNavigate(); // use this hook to redirect to another page
  const [error, setError] = useState(null); // store any errors to display a message to user
  // start with blank form data, then updated on submission by calling setFormData
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // send form data to server
      const res = await axios.post("/api/user/register", formData);
      console.log("Registration successful!");
      sessionStorage.setItem("jwt", JSON.stringify(res.data)); // store user data in session storage
      onSuccessfulSignup(res.data.user);
      navigate("/profile"); // redirect to profile page
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };
  // if user is already logged in, redirect to home page
  useEffect(() => {
    const storedData = sessionStorage.getItem("jwt");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.isAuthenticated) {
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        mt: 8,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "background.default",
        py: 2,
      }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.paper",
          padding: 2,
          borderRadius: 1,
          boxShadow: 1,
          width: "100%",
          maxWidth: 400,
        }}>
        <Typography
          component="h1"
          variant="h5">
          Register
        </Typography>
        {error && (
          <Typography
            color="error"
            variant="body2"
            style={{ marginTop: "8px" }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary">
            Sign Up
          </Button>
        </form>
        <Typography
          variant="body2"
          align="center"
          style={{ marginTop: "16px" }}>
          Already registered?{" "}
          <RouterLink
            to="/login"
            underline="always">
            Click here to login
          </RouterLink>
        </Typography>
      </Box>
    </Container>
  );
};
Register.propTypes = {
  onSuccessfulSignup: PropTypes.func.isRequired,
};
export default Register;
