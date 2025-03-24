import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  Divider,
  Snackbar,
} from "@mui/material";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(false);
  const theme = useTheme();

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
  }, [id]);

  // 🛒 Add to Cart Function
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
  
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Updated cart:", cart); // Debugging log
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

  return (
    <Box sx={{ padding: { xs: 2, md: 5 }, maxWidth: 1200, margin: "auto" }}>
      <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, boxShadow: 3, borderRadius: 3 }}>
        {/* Product Image */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              maxWidth: 450,
              height: "auto",
              objectFit: "contain",
              bgcolor: theme.palette.mode === "dark" ? "#222" : "#f9f9f9",
              borderRadius: 2,
              padding: 2,
            }}
          />
        </Box>

        {/* Product Details */}
        <CardContent sx={{ flex: 1, padding: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            {product.category} • {product.brand}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" color="primary" fontWeight="bold">
            ₹{product.price}
          </Typography>

          <Typography variant="body1" color="secondary" sx={{ mt: 1 }}>
            ⭐ {product.rating} / 5
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Experience the best quality with {product.name}. Designed for durability, performance, and style. Get yours today!
          </Typography>

          {/* 🛒 Add to Cart Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={addToCart}
            sx={{
              mt: 3,
              padding: "12px 24px",
              fontWeight: "bold",
              fontSize: "1rem",
              width: "100%",
              maxWidth: 300,
            }}
          >
            Add to Cart 🛒
          </Button>
        </CardContent>
      </Card>

      {/* Snackbar Notification */}
      <Snackbar
        open={cartUpdated}
        autoHideDuration={2000}
        onClose={() => setCartUpdated(false)}
        message="Item added to cart!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default ProductDetails;
