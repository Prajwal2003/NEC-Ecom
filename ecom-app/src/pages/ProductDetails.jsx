import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
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
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
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
        // Get related products (same category, excluding current product)
        const related = data
          .filter(item => item.category === foundProduct.category && item.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
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
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: { xs: 2, md: 4 } }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      ) : !product ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" color="error">Product not found</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
            {/* Product Images */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
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

            {/* Product Details and Quick Info */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Product Title and Basic Info */}
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {product.category} • {product.brand}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mt: 2,
                  p: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 'fit-content'
                }}>
                  <Rating value={product.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({product.rating} / 5)
                  </Typography>
                </Box>
              </Box>

              {/* Price Box */}
              <Box sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ₹{product.price.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Inclusive of all taxes
                </Typography>
              </Box>

              {/* Quick Info Box */}
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Info
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Brand:</Typography>
                    <Typography variant="body2" fontWeight="medium">{product.brand}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Category:</Typography>
                    <Typography variant="body2" fontWeight="medium">{product.category}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Seller:</Typography>
                    <Typography variant="body2" fontWeight="medium">{product.seller.sellerName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Return Policy:</Typography>
                    <Typography variant="body2" fontWeight="medium">{product.seller.returnPolicy}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Warranty:</Typography>
                    <Typography variant="body2" fontWeight="medium">{product.seller.warranty}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => setCartDialogOpen(true)}
                  sx={{ 
                    flex: 1,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => setWishlistDialogOpen(true)}
                  sx={{ 
                    flex: 1,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Add to Wishlist
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Detailed Information Accordions */}
          <Box sx={{ mt: 4 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">Product Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Key Features */}
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Key Features
                    </Typography>
                    <Grid container spacing={2}>
                      {product.features.map((feature, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: 1,
                            p: 1.5,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 1
                          }}>
                            <Typography variant="body1">• {feature}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {product.description}
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">Seller Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1
                    }}>
                      <Typography variant="subtitle2" color="text.secondary">Seller</Typography>
                      <Typography variant="body1">{product.seller.sellerName}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Rating value={product.seller.sellerRating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2">({product.seller.sellerRating})</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1
                    }}>
                      <Typography variant="subtitle2" color="text.secondary">Return Policy</Typography>
                      <Typography variant="body1">{product.seller.returnPolicy}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1
                    }}>
                      <Typography variant="subtitle2" color="text.secondary">Warranty</Typography>
                      <Typography variant="body1">{product.seller.warranty}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Related Products
              </Typography>
              <Grid container spacing={3}>
                {relatedProducts.map((relatedProduct) => (
                  <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                    <Card 
                      component={Link} 
                      to={`/product/${relatedProduct.id}`}
                      sx={{ 
                        textDecoration: 'none',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={relatedProduct.image}
                        alt={relatedProduct.name}
                        sx={{ objectFit: 'contain', p: 2 }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                          {relatedProduct.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {relatedProduct.brand}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={relatedProduct.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="body2">({relatedProduct.rating})</Typography>
                        </Box>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ₹{relatedProduct.price.toLocaleString('en-IN')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}

      {/* Cart Dialog */}
      <Dialog 
        open={cartDialogOpen} 
        onClose={() => setCartDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ShoppingCartIcon />
          Add to Cart
        </DialogTitle>
        <DialogContent sx={{ pt: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'background.default',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              {product?.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating value={product?.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">({product?.rating})</Typography>
            </Box>
            <Typography variant="h6" color="primary.main">
              ₹{product?.price.toLocaleString('en-IN')}
            </Typography>
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
            Select Cart
          </Typography>
          <Box sx={{ 
            maxHeight: 200, 
            overflow: 'auto', 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            mb: 2,
            bgcolor: 'background.default'
          }}>
            {Object.keys(carts).length > 0 ? (
              Object.keys(carts).map((cartName) => (
                <FormControlLabel
                  key={cartName}
                  control={
                    <Checkbox 
                      checked={selectedCart === cartName} 
                      onChange={() => setSelectedCart(cartName)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography color="text.primary">{cartName}</Typography>
                      <Typography color="text.secondary">
                        {carts[cartName]?.length || 0} items
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    width: '100%', 
                    m: 0.5,
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No carts available. Create a new one below.
              </Typography>
            )}
          </Box>

          <Box sx={{ 
            mb: 3,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
              Create New Cart
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Cart Name"
                fullWidth
                variant="outlined"
                value={newCartName}
                onChange={(e) => setNewCartName(e.target.value)}
                size="small"
              />
              <Button 
                onClick={createNewCart} 
                variant="contained"
                color="primary"
                disabled={!newCartName.trim()}
              >
                Create
              </Button>
            </Box>
          </Box>

          <Box sx={{ 
            mb: 2,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
              Quantity
            </Typography>
            <Select 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              fullWidth
              size="small"
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2, 
          pt: 0, 
          bgcolor: 'background.paper', 
          borderTop: '1px solid', 
          borderColor: 'divider',
          gap: 1
        }}>
          <Button 
            onClick={() => setCartDialogOpen(false)} 
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={addToSelectedCart} 
            variant="contained"
            color="primary"
            disabled={!selectedCart}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      {/* Wishlist Dialog */}
      <Dialog 
        open={wishlistDialogOpen} 
        onClose={() => setWishlistDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'secondary.main', 
          color: 'white',
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'secondary.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <FavoriteIcon />
          Add to Wishlist
        </DialogTitle>
        <DialogContent sx={{ pt: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'background.default',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              {product?.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating value={product?.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">({product?.rating})</Typography>
            </Box>
            <Typography variant="h6" color="primary.main">
              ₹{product?.price.toLocaleString('en-IN')}
            </Typography>
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
            Select Wishlists
          </Typography>
          <Box sx={{ 
            maxHeight: 200, 
            overflow: 'auto', 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            mb: 2,
            bgcolor: 'background.default'
          }}>
            {Object.keys(wishlists).length > 0 ? (
              Object.keys(wishlists).map((wishlistName) => (
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
                      color="secondary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography color="text.primary">{wishlistName}</Typography>
                      <Typography color="text.secondary">
                        {wishlists[wishlistName]?.length || 0} items
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    width: '100%', 
                    m: 0.5,
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No wishlists available. Create a new one below.
              </Typography>
            )}
          </Box>

          <Box sx={{ 
            mb: 2,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
              Create New Wishlist
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Wishlist Name"
                fullWidth
                variant="outlined"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'secondary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
                  }
                }}
              />
              <Button 
                onClick={createNewWishlist} 
                variant="contained"
                color="secondary"
                disabled={!newWishlistName.trim()}
                sx={{
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.dark'
                  }
                }}
              >
                Create
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2, 
          pt: 0, 
          bgcolor: 'background.paper', 
          borderTop: '1px solid', 
          borderColor: 'divider',
          gap: 1
        }}>
          <Button 
            onClick={() => setWishlistDialogOpen(false)} 
            color="inherit"
            variant="outlined"
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'secondary.main',
                bgcolor: 'action.hover'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={addToSelectedWishlists} 
            variant="contained"
            color="secondary"
            disabled={selectedWishlists.length === 0}
            sx={{
              bgcolor: 'secondary.main',
              '&:hover': {
                bgcolor: 'secondary.dark'
              }
            }}
          >
            Add to Wishlist
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={cartUpdated} 
        autoHideDuration={2000} 
        onClose={() => setCartUpdated(false)} 
        message="Item added to cart!" 
      />
    </Box>
  );
};

export default ProductDetails;