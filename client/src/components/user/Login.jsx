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

const Login = ({ onSuccessfulLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/user/login", formData);
      sessionStorage.setItem("jwt", JSON.stringify(res.data));
      onSuccessfulLogin(res.data.user);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      setError("Invalid username or password. Please try again.");
    }
  };
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
          Login
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
            id="usernameOrEmail"
            label="Username or Email"
            name="usernameOrEmail"
            autoComplete="usernameOrEmail"
            autoFocus
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
            Log In
          </Button>
        </form>
        <Typography
          variant="body2"
          align="center"
          style={{ marginTop: "16px" }}>
          Don't have an account?{" "}
          <RouterLink
            to="/register"
            underline="always">
            Sign up here
          </RouterLink>
        </Typography>
      </Box>
    </Container>
  );
};
Login.propTypes = {
  onSuccessfulLogin: PropTypes.func.isRequired,
};
export default Login;
