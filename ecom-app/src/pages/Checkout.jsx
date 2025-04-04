import React from "react";
import { Box, Typography, Divider, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedCarts = state?.selectedCarts || [];

  const handlePlaceOrder = () => {
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrders = selectedCarts.map((cart) => ({
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      cartName: cart.name,
      products: cart.items,
      status: "Order Placed",
      date: new Date().toISOString(),
      totalAmount: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }));

    localStorage.setItem("orders", JSON.stringify([...existingOrders, ...newOrders]));

    // Remove selected carts
    const allCarts = JSON.parse(localStorage.getItem("carts")) || {};
    selectedCarts.forEach((cart) => delete allCarts[cart.name]);
    localStorage.setItem("carts", JSON.stringify(allCarts));

    navigate("/orders");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Checkout</Typography>
      <Divider sx={{ mb: 3 }} />

      {selectedCarts.map((cart) => (
        <Paper key={cart.name} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">{cart.name} Cart</Typography>
          <Divider sx={{ my: 1 }} />
          {cart.items.map((item) => (
            <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
              <Typography>{item.name} × {item.quantity}</Typography>
              <Typography>₹{(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Typography fontWeight="bold">
            Total: ₹{cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
          </Typography>
        </Paper>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handlePlaceOrder}
        sx={{ mt: 2 }}
      >
        Place Order
      </Button>
    </Box>
  );
};

export default Checkout;
