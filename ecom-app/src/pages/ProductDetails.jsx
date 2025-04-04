import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);
  const [cartDialogOpen, setCartDialogOpen] = useState(false);

  const [wishlists, setWishlists] = useState({});
  const [selectedWishlists, setSelectedWishlists] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState("");

  const [carts, setCarts] = useState({});
  const [selectedCart, setSelectedCart] = useState("");
  const [newCartName, setNewCartName] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((item) => item.id === parseInt(id));
        setProduct(foundProduct);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading product:", error);
        setLoading(false);
      });

    setWishlists(JSON.parse(localStorage.getItem("wishlists")) || {});
    setCarts(JSON.parse(localStorage.getItem("carts")) || {});
  }, [id]);

  const saveCarts = (updatedCarts) => {
    setCarts(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
  };

  const addToSelectedCart = () => {
    if (!selectedCart || !product) return;

    const updatedCarts = { ...carts };
    const cartItems = updatedCarts[selectedCart] || [];

    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    if (existingIndex !== -1) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push({ ...product, quantity });
    }

    updatedCarts[selectedCart] = cartItems;
    saveCarts(updatedCarts);
    setCartDialogOpen(false);
    setCartUpdated(true);
  };

  const createNewCart = () => {
    if (!newCartName.trim() || carts[newCartName]) return;

    const updatedCarts = { ...carts, [newCartName]: [] };
    saveCarts(updatedCarts);
    setSelectedCart(newCartName);
    setNewCartName("");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Typography sx={{ textAlign: "center", mt: 5, fontSize: "1.5rem", color: "gray" }}>
        Product not found.
      </Typography>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const saveWishlists = (updatedWishlists) => {
    setWishlists(updatedWishlists);
    localStorage.setItem("wishlists", JSON.stringify(updatedWishlists));
  };
  
  const addToSelectedWishlists = () => {
    if (!selectedWishlists.length || !product) return;
  
    const updatedWishlists = { ...wishlists };
  
    selectedWishlists.forEach((wishlistName) => {
      if (!updatedWishlists[wishlistName]) {
        updatedWishlists[wishlistName] = [];
      }
      const exists = updatedWishlists[wishlistName].some((item) => item.id === product.id);
      if (!exists) {
        updatedWishlists[wishlistName].push(product);
      }
    });
  
    saveWishlists(updatedWishlists);
    setWishlistDialogOpen(false);
  };
  
  const createNewWishlist = () => {
    if (!newWishlistName.trim() || wishlists[newWishlistName]) return;
  
    const updatedWishlists = { ...wishlists, [newWishlistName]: [] };
    saveWishlists(updatedWishlists);
    setSelectedWishlists([...selectedWishlists, newWishlistName]);
    setNewWishlistName("");
  };
  

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" },width: "100vw", gap: 4, padding: { xs: 2, md: 5 } }}>
      {/* Product Images */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Slider {...sliderSettings} style={{ width: "100%", maxWidth: 500 }}>
          {product.images.map((image, index) => (
            <Box key={index} sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={image}
                alt={`Product ${index}`}
                style={{
                  width: "100%",
                  maxWidth: 500,
                  height: "auto",
                  objectFit: "contain",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

      {/* Product Details */}
      <Box sx={{ flex: 1, textAlign: "left", padding: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {product.category} • {product.brand}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" color="primary" fontWeight="bold">
          ₹{product.price}
        </Typography>

        <Typography variant="body1" color="secondary" sx={{ mt: 1 }}>
          ⭐ {product.rating} / 5
        </Typography>

        <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
          Features:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mt: 1 }}>
          {product.features.map((feature, index) => (
            <Typography key={index} component="li" variant="body1" sx={{ mb: 1 }}>
              {feature}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button variant="contained" color="primary" onClick={() => setCartDialogOpen(true)}>
            Add to Cart
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setWishlistDialogOpen(true)}>
  Add to Wishlist
</Button>

        </Box>
      </Box>

      {/* Cart Dialog */}
      <Dialog open={cartDialogOpen} onClose={() => setCartDialogOpen(false)}>
        <DialogTitle>Select Cart</DialogTitle>
        <DialogContent>
          {Object.keys(carts).map((cartName) => (
            <FormControlLabel
              key={cartName}
              control={<Checkbox checked={selectedCart === cartName} onChange={() => setSelectedCart(cartName)} />}
              label={cartName}
            />
          ))}
          <TextField
            label="New Cart Name"
            fullWidth
            variant="outlined"
            value={newCartName}
            onChange={(e) => setNewCartName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={createNewCart} sx={{ mt: 1 }}>Create Cart</Button>

          {/* Quantity Selector */}
          <Typography sx={{ mt: 2 }}>Quantity:</Typography>
          <Select value={quantity} onChange={(e) => setQuantity(e.target.value)} fullWidth>
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={addToSelectedCart} variant="contained">Add to Selected Cart</Button>
        </DialogActions>
      </Dialog>
      {/* Wishlist Dialog */}
<Dialog open={wishlistDialogOpen} onClose={() => setWishlistDialogOpen(false)}>
  <DialogTitle>Select Wishlist</DialogTitle>
  <DialogContent>
    {Object.keys(wishlists).map((wishlistName) => (
      <FormControlLabel
        key={wishlistName}
        control={
          <Checkbox
            checked={selectedWishlists.includes(wishlistName)}
            onChange={() =>
              setSelectedWishlists((prev) =>
                prev.includes(wishlistName)
                  ? prev.filter((name) => name !== wishlistName)
                  : [...prev, wishlistName]
              )
            }
          />
        }
        label={wishlistName}
      />
    ))}
    <TextField
      label="New Wishlist Name"
      fullWidth
      variant="outlined"
      value={newWishlistName}
      onChange={(e) => setNewWishlistName(e.target.value)}
      sx={{ mt: 2 }}
    />
    <Button onClick={createNewWishlist} sx={{ mt: 1 }}>Create Wishlist</Button>
  </DialogContent>
  <DialogActions>
    <Button onClick={addToSelectedWishlists} variant="contained">
      Add to Selected Wishlist(s)
    </Button>
  </DialogActions>
</Dialog>


      <Snackbar open={cartUpdated} autoHideDuration={2000} onClose={() => setCartUpdated(false)} message="Item added to cart!" />
    </Box>
  );
};

export default ProductDetails;
