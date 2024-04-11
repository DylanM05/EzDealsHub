import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Footer from './components/main/Footer';
import HomePage from './components/main/HomePage';
import ProductList from './components/products/ProductList';
import About from './components/main/About';
import Register from './components/user/Register';
import NavBar from './components/main/NavBar';
import Login from './components/user/Login';
import Profile from './components/user/Profile';
import axios from 'axios';
import CreateProduct from './components/products/CreateProduct';
import ProductDetails from './components/products/ProductDetails';
import ShopList from './components/shops/ShopList';
import CreateShop from './components/shops/CreateShop';
import Shop from './components/shops/Shop';
import AddProducts from './components/products/AddProducts';
import Cart from './components/cart/Cart';
import Orders from './components/user/Orders';
import OrderDetail from './components/user/OrderDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B2D06', // colours here
    },
    secondary: {
        main: '#954331', // secondary colours if we need any
    },
    background: {
        default: '#CCC4C2', // background colour of the site pages
        paper: '#FFFFFF', // background colour for paper/forms/etc
    },
    // colour overrides can go here, not sure if we'll need any
  },
  spacing: 8,
  // typography themes here anyone? overrides?
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          // global card styles
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
          },
          // can add more here
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState({});

  const handleSuccessfulLogin = (userInfo) => {
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const handleLogout = () => {
    console.log("Logging out");
    sessionStorage.removeItem("jwt");
    axios.get("/api/user/logout");
    setIsAuthenticated(false);
    setUser(null);
  };
  const handleUserUpdate = (updatedUser) => {
    // Update the user in the component state
    setUser(updatedUser);
  };

  React.useEffect(() => {
    const storedData = sessionStorage.getItem("jwt");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setIsAuthenticated(parsedData.isAuthenticated);
      setUser(parsedData.user);
    }
  }, []);

  return (
   <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} user={user} />
      <Box
        component="main"
        sx={{
          paddingTop: '64px',
          paddingBottom: '64px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register onSuccessfulSignup={handleSuccessfulLogin}/>} />
        <Route path="/products" element={<ProductList user={user} isAuthenticated={isAuthenticated}/>} />
        <Route path="/shops" element={<ShopList user={user} isAuthenticated={isAuthenticated}/>} />
        <Route path="/login" element={<Login onSuccessfulLogin={handleSuccessfulLogin} />} />
        <Route path="/about" element={<About />} />
        <Route path="/newproduct" element={<CreateProduct />} />
        <Route path="/profile" element={isAuthenticated?<Profile user={user} onUserUpdate={handleUserUpdate}/>:<Navigate to="/login" />} />
        <Route path="/productdetails/:productId" element={<ProductDetails />} />
        <Route path="/createShop" element={<CreateShop />}/>
        <Route path="/addproduct/:shopId" element={<AddProducts />}/>
        <Route path="/shops/:shopId" element={<Shop user={user} />} />
        <Route path="/cart" element={<Cart user={user} />}/>
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
      </Routes>
      </Box>
      <Footer />
    </BrowserRouter>
    </ThemeProvider> 
  );
}

export default App;
