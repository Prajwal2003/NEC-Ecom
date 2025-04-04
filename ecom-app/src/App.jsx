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
      <Box sx={{ mb: 5 }}>
  <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
</Box>


  <Box sx={{ flexGrow: 1 }}>
    <Routes>
      <Route path="/" element={<HeroSection />} />
      <Route path="/products" element={<ProductListing />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  </Box>

  <Footer />
</Box>


      </Router>
    </ThemeProvider>
  );
};

export default App;
