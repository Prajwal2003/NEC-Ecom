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
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cart = () => {
  const [carts, setCarts] = useState({});
  const [newCartName, setNewCartName] = useState("");
  const [selectedCarts, setSelectedCarts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
    setCarts(storedCarts);
  }, []);

  const saveCarts = (updatedCarts) => {
    setCarts(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
  };

  const addNewCart = () => {
    if (!newCartName.trim() || carts[newCartName]) return;
    const updatedCarts = { ...carts, [newCartName]: [] };
    saveCarts(updatedCarts);
    setNewCartName("");
  };

  const removeCart = (cartName) => {
    const updatedCarts = { ...carts };
    delete updatedCarts[cartName];
    saveCarts(updatedCarts);
    setSelectedCarts((prev) => prev.filter((name) => name !== cartName));
  };

  const updateQuantity = (cartName, productId, newQuantity) => {
    const updatedCarts = { ...carts };
    updatedCarts[cartName] = updatedCarts[cartName].map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCarts(updatedCarts);
  };

  const removeItem = (cartName, productId) => {
    const updatedCarts = { ...carts };
    updatedCarts[cartName] = updatedCarts[cartName].filter((item) => item.id !== productId);
    saveCarts(updatedCarts);
  };

  const calculateSummary = (cart) => {
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    return { totalItems, totalPrice };
  };

  const handleCartSelection = (cartName) => {
    setSelectedCarts((prev) =>
      prev.includes(cartName)
        ? prev.filter((name) => name !== cartName)
        : [...prev, cartName]
    );
  };

  const handleMultiCartCheckout = () => {
    const selectedData = selectedCarts.map((name) => {
      const items = carts[name];
      const { totalItems, totalPrice } = calculateSummary(items);
      return {
        name,
        items,
        summary: { totalItems, totalPrice },
      };
    });
  
    const updatedCarts = { ...carts };
    selectedCarts.forEach((name) => {
      delete updatedCarts[name];
    });
    saveCarts(updatedCarts);
    setSelectedCarts([]);
  
    navigate("/checkout", {
      state: {
        selectedCarts: selectedData,
      },
    });
  };
  

  const handleSingleCartCheckout = (cartName) => {
    const items = carts[cartName];
    if (items.length === 0) return;
  
    const { totalItems, totalPrice } = calculateSummary(items);
  
    const updatedCarts = { ...carts };
    delete updatedCarts[cartName];
    saveCarts(updatedCarts);
  
    navigate("/checkout", {
      state: {
        selectedCarts: [
          {
            name: cartName,
            items,
            summary: { totalItems, totalPrice },
          },
        ],
      },
    });
  };
  

  return (
    <>
      <Navbar sx={{ mb: '10px' }} />
      <Box sx={{ padding: { xs: 2, md: 4 }, width: "100vw", minHeight: "100vh", mt: '100px' }}>
        <Typography variant="h5" fontWeight="bold">
          Your Shopping Carts
        </Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
          <TextField
            label="New Cart Name"
            value={newCartName}
            onChange={(e) => setNewCartName(e.target.value)}
            variant="outlined"
            sx={{ flex: 1, height: "48px" }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ height: "48px", px: 3 }}
            onClick={addNewCart}
          >
            Create Cart
          </Button>
        </Box>

        {Object.keys(carts).length > 0 && (
          <Button
            variant="contained"
            color="success"
            sx={{ mb: 3 }}
            disabled={selectedCarts.length === 0}
            onClick={handleMultiCartCheckout}
          >
            Checkout Selected ({selectedCarts.length})
          </Button>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
          {Object.keys(carts).length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
                width: "100%",
              }}
            >
              <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: "gray" }} />
              <Typography variant="h6" sx={{ color: "gray", mt: 2 }}>
                No carts created yet.
              </Typography>
            </Box>
          ) : (
            Object.keys(carts).map((cartName) => {
              const cart = carts[cartName];
              const { totalItems, totalPrice } = calculateSummary(cart);

              return (
                <Paper
                  key={cartName}
                  sx={{
                    p: 3,
                    width: "100%",
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: cart.length > 0 ? "flex-start" : "center",
                    alignItems: cart.length > 0 ? "stretch" : "center",
                    boxShadow: 3,
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedCarts.includes(cartName)}
                            onChange={() => handleCartSelection(cartName)}
                          />
                        }
                        label={<Typography variant="h6" fontWeight="bold">{cartName} Cart</Typography>}
                      />
                    </Box>
                    <Button size="small" color="secondary" startIcon={<DeleteIcon />} onClick={() => removeCart(cartName)}>
                      Remove Cart
                    </Button>
                  </Box>
                  <Divider sx={{ my: 2, width: "100%" }} />

                  <Grid container spacing={3} sx={{ flexGrow: 1, width: "100%" }}>
                    <Grid item xs={12} md={8}>
                      {cart.length === 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <Typography color="gray">This cart is empty.</Typography>
                        </Box>
                      ) : (
                        cart.map((item) => (
                          <Paper
                            key={item.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: 2,
                              boxShadow: 1,
                              borderRadius: 2,
                              mb: 2,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                              <img
                                src={item.image || "/fallback-image.jpg"}
                                alt={item.name}
                                onError={(e) => (e.target.src = "/fallback-image.jpg")}
                                style={{
                                  width: 90,
                                  height: 90,
                                  objectFit: "contain",
                                  borderRadius: 8,
                                  marginRight: 12,
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" fontWeight="bold">
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  ₹{item.price.toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Select
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(cartName, item.id, parseInt(e.target.value))
                                }
                                sx={{ minWidth: 55, height: 36 }}
                              >
                                {[...Array(10).keys()].map((num) => (
                                  <MenuItem key={num + 1} value={num + 1}>
                                    {num + 1}
                                  </MenuItem>
                                ))}
                              </Select>

                              <IconButton color="error" onClick={() => removeItem(cartName, item.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Paper>
                        ))
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Paper sx={{ padding: 3, boxShadow: 2, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {cartName} Summary
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Total Items: {totalItems}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Total Price: ₹{totalPrice.toFixed(2)}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ mt: 2, py: 1.5 }}
                          disabled={cart.length === 0}
                          onClick={() => handleSingleCartCheckout(cartName)}
                        >
                          Checkout {cartName}
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Cart;
