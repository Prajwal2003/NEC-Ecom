import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  Grid,
  Avatar,
  TextField,
  MenuItem,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const countryList = [
  "India",
  "United States",
  "Canada",
  "Australia",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "South Africa",
];

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedCarts = state?.selectedCarts || [];

  const allItems = selectedCarts.flatMap((cart) => cart.items);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    pinCode: "",
    city: "",
    state: "",
    country: "India",
  });

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      cartName: "UnifiedCart",
      products: allItems,
      status: "Order Placed",
      date: new Date().toISOString(),
      totalAmount: allItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      shippingAddress: address,
    };

    localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));

    const allCarts = JSON.parse(localStorage.getItem("carts")) || {};
    selectedCarts.forEach((cart) => delete allCarts[cart.name]);
    localStorage.setItem("carts", JSON.stringify(allCarts));

    navigate("/orders");
  };

  const totalAmount = allItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Review Orders
      </Typography>

      <Grid container spacing={3}>
        {/* Left: Items and Address */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {allItems.map((item, index) => (
              <Box
                key={`${item.id}-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    variant="square"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: 80, height: 80, borderRadius: 1 }}
                  />
                  <Box>
                    <Typography fontWeight="500">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                </Box>
                <Typography fontWeight="bold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight="bold" textAlign="right">
              Total: ₹{totalAmount.toFixed(2)}
            </Typography>
          </Paper>

          {/* Address Form */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={address.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={address.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={address.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="addressLine1"
                  label="Address Line 1"
                  value={address.addressLine1}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="addressLine2"
                  label="Address Line 2"
                  value={address.addressLine2}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="pinCode"
                  label="Pin Code"
                  value={address.pinCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="city"
                  label="city"
                  value={address.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="state"
                  label="State"
                  value={address.state}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  name="country"
                  label="Country"
                  value={address.country}
                  onChange={handleInputChange}
                >
                  {countryList.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right: Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Item ({allItems.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="subtitle1">Subtotal</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ₹{totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Button
  variant="contained"
  onClick={() => {
    const totalAmount = allItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    navigate("/payment", {
      state: { totalAmount, selectedAddress: address }, 
    });
  }}
  fullWidth
  sx={{ mt: 3 }}
  disabled={
    !address.firstName ||
    !address.lastName ||
    !address.email ||
    !address.addressLine1 ||
    !address.pinCode ||
    !address.city ||
    !address.state ||
    !address.country
  }
>
  Confirm and Pay Now
</Button>



            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              mt={2}
            >
              Purchase protected by YourSite Money Back Guarantee
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
