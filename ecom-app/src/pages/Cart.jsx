import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart data from localStorage:", storedCart);
    setCart(storedCart);
  }, []);

  // Remove Item from Cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Update Quantity
  const updateQuantity = (id, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate Subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 1200, margin: "auto" }}>
      {/* Fixed Shopping Cart Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "left" }}>
          Shopping Cart 🛒
        </Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />
      </Box>

      {cart.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: "gray" }} />
          <Typography variant="h6" sx={{ color: "gray", mt: 2 }}>
            Your cart is empty.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Left Section - Cart Items */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cart.map((item) => (
                <Paper
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 2,
                    boxShadow: 2,
                    borderRadius: 2,
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Product Image & Details */}
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <img
                      src={item.image || "/fallback-image.jpg"} // Use fallback image if missing
                      alt={item.name}
                      onError={(e) => (e.target.src = "/fallback-image.jpg")} // Fallback on error
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "contain",
                        borderRadius: 8,
                        marginRight: 16,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{item.price.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ⭐ {item.rating} / 5
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quantity Selector & Remove Button */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      sx={{ minWidth: 60, fontSize: "1rem" }}
                    >
                      {[...Array(10).keys()].map((num) => (
                        <MenuItem key={num + 1} value={num + 1}>
                          {num + 1}
                        </MenuItem>
                      ))}
                    </Select>

                    <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>

          {/* Right Section - Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                padding: 3,
                boxShadow: 3,
                borderRadius: 2,
                position: { md: "sticky" },
                top: 20,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">
                Subtotal: <strong>₹{subtotal.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Shipping & taxes calculated at checkout)
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, padding: "12px", fontSize: "1rem", fontWeight: "bold" }}
                onClick={() => alert("Proceeding to Checkout...")}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
