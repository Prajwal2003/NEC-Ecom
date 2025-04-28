import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Grid,
  Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTheme } from "@mui/material/styles";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Wishlist = () => {
  const theme = useTheme();
  const [wishlists, setWishlists] = useState({});
  const [newWishlistName, setNewWishlistName] = useState("");
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWishlist, setSelectedWishlist] = useState("");
  const [carts, setCarts] = useState({});

  useEffect(() => {
    setWishlists(JSON.parse(localStorage.getItem("wishlists")) || {});
    setCarts(JSON.parse(localStorage.getItem("carts")) || {});
  }, []);

  const saveWishlists = (updatedWishlists) => {
    setWishlists(updatedWishlists);
    localStorage.setItem("wishlists", JSON.stringify(updatedWishlists));
  };

  const saveCarts = (updatedCarts) => {
    setCarts(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
  };

  const addWishlist = () => {
    if (newWishlistName.trim() === "") return;
    const updatedWishlists = { ...wishlists, [newWishlistName]: [] };
    saveWishlists(updatedWishlists);
    setNewWishlistName("");
  };

  const removeWishlist = (wishlistName) => {
    const updatedWishlists = { ...wishlists };
    delete updatedWishlists[wishlistName];
    saveWishlists(updatedWishlists);
  };

  const removeFromWishlist = (wishlistName, productId) => {
    const updatedWishlists = {
      ...wishlists,
      [wishlistName]: wishlists[wishlistName].filter((item) => item.id !== productId),
    };
    saveWishlists(updatedWishlists);
  };

  const openCartDialog = (wishlistName, product) => {
    setSelectedProduct(product);
    setSelectedWishlist(wishlistName);
    setCartDialogOpen(true);
  };

  const moveToCart = (cartName) => {
    if (!selectedProduct || !cartName) return;
    const updatedCarts = { ...carts, [cartName]: [...(carts[cartName] || []), { ...selectedProduct, quantity: 1 }] };
    saveCarts(updatedCarts);
    removeFromWishlist(selectedWishlist, selectedProduct.id);
    setCartDialogOpen(false);
  };

  const moveAllToCart = (wishlistName) => {
    if (!wishlists[wishlistName] || wishlists[wishlistName].length === 0) return;
    const updatedCarts = { ...carts, [wishlistName]: [...(carts[wishlistName] || []), ...wishlists[wishlistName].map(item => ({ ...item, quantity: 1 }))] };
    saveCarts(updatedCarts);
    removeWishlist(wishlistName);
  };

  return (
    <>
      <Navbar sx={{ mb: '10px' }} />
      <Box sx={{ width: "100vw", minHeight: "100vh", bgcolor: theme.palette.background.default, p: 4, mt: '100px' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: theme.palette.text.primary }}>
          Wishlists
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField 
            label="New Wishlist Name" 
            value={newWishlistName} 
            onChange={(e) => setNewWishlistName(e.target.value)} 
            fullWidth 
            sx={{ input: { color: theme.palette.text.primary } }}
          />
          <Button variant="contained" onClick={addWishlist}>Create</Button>
        </Box>
        <Divider sx={{ mb: 3, bgcolor: theme.palette.divider }} />
        {Object.keys(wishlists).length === 0 ? (
          <Typography color={theme.palette.text.secondary}>No wishlists yet.</Typography>
        ) : (
          Object.keys(wishlists).map((wishlistName) => (
            <Paper key={wishlistName} sx={{ p: 3, mb: 3, width: "100%", bgcolor: theme.palette.background.paper }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>{wishlistName}</Typography>
              <Button variant="outlined" color="error" onClick={() => removeWishlist(wishlistName)} sx={{ mt: 1, mb: 2 }}>
                Delete Wishlist
              </Button>
              <Button variant="contained" color="primary" onClick={() => moveAllToCart(wishlistName)} sx={{ ml: 2 }}>
                Move All to Cart
              </Button>
              <Divider sx={{ my: 2, bgcolor: theme.palette.divider }} />
              <Grid container spacing={2}>
                {wishlists[wishlistName].map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: theme.palette.background.paper }}>
                      <img
                        src={product.image || "/fallback-image.jpg"}
                        alt={product.name}
                        onClick={() => window.location.href = `/product/${product.id}`}
                        style={{ width: 80, height: 80, cursor: "pointer", objectFit: "contain" }}
                      />
                      <ListItemText primary={product.name} secondary={`₹${product.price}`} sx={{ color: theme.palette.text.primary }} />
                      <IconButton color="primary" onClick={() => openCartDialog(wishlistName, product)}>
                        <ShoppingCartIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => removeFromWishlist(wishlistName, product.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ))
        )}
        <Dialog open={cartDialogOpen} onClose={() => setCartDialogOpen(false)}>
          <DialogTitle>Select a Cart</DialogTitle>
          <DialogContent>
            <Select fullWidth value={selectedWishlist} onChange={(e) => moveToCart(e.target.value)}>
              {Object.keys(carts).map((cartName) => (
                <MenuItem key={cartName} value={cartName}>{cartName}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCartDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </>
  );
};

export default Wishlist;