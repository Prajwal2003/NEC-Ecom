import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import ProductListing from "./pages/ProductListing";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Wishlist from "./pages/wishlist";
import Footer from "./components/Footer";
import OrdersPage from "./pages/OrderSection";
import Checkout from "./pages/Checkout";
import PaymentGateway from "./pages/PaymentGateway";
import Bids from "./pages/Bids";
import Login from './Sellerside/Front-end/Login/Login'
import Register from './Sellerside/Front-end/Signup/Signup'
import Sellerprofile from './Sellerside/Front-end/Maindashboard'

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ mb: 0 }}>
  {/* <Navbar darkMode={darkMode} setDarkMode={setDarkMode} /> */}
</Box>


  <Box sx={{ flexGrow: 1 }}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HeroSection />} />
      <Route path="/main" element={<Sellerprofile />} />
      <Route path="/products" element={<ProductListing />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/carts" element={<Profile />} />
      <Route path="/profile/wishlists" element={<Profile />} />
      <Route path="/profile/bids" element={<Bids />} />
      <Route path="/profile/settings" element={<Profile />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<PaymentGateway />} />
    </Routes>
  </Box>

  {/* <Footer /> */}
</Box>


      </Router>
    </ThemeProvider>
  );
};

export default App;
