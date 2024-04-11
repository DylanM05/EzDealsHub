import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import axios from "axios";

const pages = ["Products", "Shops", "About"];
const settings = ["Profile", "Orders", "Logout"];

const NavBar = ({ isAuthenticated, onLogout, user }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartItemCount = async () => {
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

        const itemCount = response.data.products.reduce(
          (total, product) => total + product.quantity,
          0
        );
        setCartItemCount(itemCount);
      } else {
        console.error("Token not found or invalid format");
      }
    } catch (error) {
      console.error("Error fetching cart item count:", error);
    }
  };

  useEffect(() => {
    fetchCartItemCount();
  }, [user]);
  useEffect(() => {
    const handleCartChanged = () => {
      fetchCartItemCount();
    };

    document.addEventListener("cartChanged", handleCartChanged);

    return () => {
      document.removeEventListener("cartChanged", handleCartChanged);
    };
  }, [user]);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleUserMenuClick = (setting) => {
    handleCloseUserMenu();

    if (setting === "Logout") {
      onLogout();
    }
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width="50"
            height="50"
          />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Poppins",
              fontWeight: 500,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              marginLeft: "6px",
            }}>
            EzDealsHub
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}>
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={"/" + page}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/" + page}
                sx={{ my: 2, color: "white", display: "block" }}>
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "flex" } }}>
            {isAuthenticated ? (
              <>
                <IconButton color="inherit">
                  <Badge
                    overlap="circular"
                    badgeContent={cartItemCount}
                    color="secondary">
                    <IconButton
                      component={Link}
                      to="/cart"
                      sx={{
                        color: "white",
                        display: "block",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "none",
                        },
                      }}>
                      <Tooltip
                        title="View Cart"
                        arrow>
                        {cartItemCount < 1 ? (
                          <ShoppingCartOutlinedIcon />
                        ) : (
                          <ShoppingCartIcon />
                        )}
                      </Tooltip>
                    </IconButton>
                  </Badge>
                </IconButton>
                <Tooltip
                  title="Open User Menu"
                  arrow>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}>
                    <Avatar
                      alt={user.name}
                      src={`/images/avatars/${user.avatar}`}
                      sx={{ color: "#FFFFFF" }}
                    />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/register"
                  sx={{ color: "white", display: "block" }}>
                  Signup
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  sx={{ color: "white", display: "block" }}>
                  Login
                </Button>
              </>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleUserMenuClick(setting)}
                  component={Link}
                  to={"/" + (setting === "Logout" ? "" : setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
export default NavBar;
