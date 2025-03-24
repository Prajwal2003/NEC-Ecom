import React, { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Autocomplete,
  IconButton,
  Badge,
  Box,
  InputAdornment,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const Navbar = ({ darkMode, setDarkMode }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Function to update cart count from localStorage
  const updateCartCount = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  useEffect(() => {
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, [updateCartCount]);

  // Debounced API Call for Search Suggestions
  useEffect(() => {
    const fetchSuggestions = debounce(() => {
      fetch("/data/search.json")
        .then((res) => res.json())
        .then((data) => setSuggestions(data.suggestions || []))
        .catch((err) => console.error("Error loading search suggestions:", err));
    }, 300);

    fetchSuggestions();
    return () => fetchSuggestions.cancel();
  }, []);

  return (
    <AppBar position="sticky" sx={{ padding: 1, boxShadow: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            cursor: "pointer",
            transition: "color 0.3s",
            "&:hover": { color: "primary.light" },
          }}
          onClick={() => navigate("/")}
        >
          Ecom
        </Typography>

        {/* Search Bar */}
        <Box sx={{ width: { xs: "65%", sm: "50%", md: "40%" } }}>
          <Autocomplete
            freeSolo
            options={suggestions}
            onChange={(event, newValue) => {
              if (newValue) navigate(`/products?search=${newValue}`);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for products..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  bgcolor: darkMode ? "#424242" : "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Dark Mode Toggle */}
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Cart with Badge */}
          <IconButton onClick={() => navigate("/cart")} color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton onClick={() => navigate("/profile")} color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
