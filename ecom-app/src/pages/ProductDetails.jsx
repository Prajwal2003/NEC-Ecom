import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Avatar,
  Chip,
  Stack,
  Alert,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VerifiedIcon from "@mui/icons-material/Verified";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "@mui/material/styles";

const ProductDetails = ({ darkMode, setDarkMode }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);

  const [wishlists, setWishlists] = useState({});
  const [selectedWishlists, setSelectedWishlists] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState("");

  const [carts, setCarts] = useState({});
  const [selectedCart, setSelectedCart] = useState("");
  const [newCartName, setNewCartName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidPlaced, setBidPlaced] = useState(false);

  const [boughtTogether, setBoughtTogether] = useState([]);
  const [addBothToCart, setAddBothToCart] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [selectedOptions, setSelectedOptions] = useState({});

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await fetch("/data/products.json");
        const productData = await productResponse.json();
        const foundProduct = productData.find((item) => item.id === parseInt(id));
        setProduct(foundProduct);

        // Get related products (all, no slice)
        const related = productData
          .filter(item => item.category === foundProduct.category && item.id !== foundProduct.id);
        setRelatedProducts(related);

        // Usually Bought Together: pick the first product from the same category (not the current one)
        const bought = productData.filter(item => item.category === foundProduct.category && item.id !== foundProduct.id).slice(0, 1);
        setBoughtTogether(bought);

        // Fetch seller data
        const sellerResponse = await fetch("/data/sellers.json");
        const sellerData = await sellerResponse.json();
        console.log("Seller Data:", sellerData);
        console.log("Product Seller Name:", foundProduct.seller.sellerName);
        const foundSeller = sellerData.find(seller => seller.name === foundProduct.seller.sellerName);
        console.log("Found Seller:", foundSeller);
        setSellerDetails(foundSeller);

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchData();
    setWishlists(JSON.parse(localStorage.getItem("wishlists")) || {});
    setCarts(JSON.parse(localStorage.getItem("carts")) || {});
  }, [id]);

  useEffect(() => {
    if (product && product.options) {
      const initial = {};
      Object.keys(product.options).forEach(key => {
        initial[key] = '';
      });
      setSelectedOptions(initial);
    }
  }, [product]);

  const handleOptionSelect = (key, value) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  };

  const allOptionsSelected = product && product.options
    ? Object.entries(product.options).every(([key, vals]) => selectedOptions[key])
    : true;

  const saveCarts = (updatedCarts) => {
    setCarts(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
  };

  const handleAddBothToCart = () => {
    setAddBothToCart(true);
    handleOpenCartDialog();
  };

  const addToSelectedCart = () => {
    if (!selectedCart || !product) return;
    const updatedCarts = { ...carts };
    const cartItems = updatedCarts[selectedCart] || [];
    // Add main product with selected options
    const existingIndex = cartItems.findIndex((item) => item.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions));
    if (existingIndex !== -1) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push({ ...product, quantity, selectedOptions: { ...selectedOptions } });
    }
    // Add bought together product(s) if needed (without options)
    if (addBothToCart && boughtTogether.length > 0) {
      boughtTogether.forEach((btProduct) => {
        const idx = cartItems.findIndex((item) => item.id === btProduct.id);
        if (idx !== -1) {
          cartItems[idx].quantity += 1;
        } else {
          cartItems.push({ ...btProduct, quantity: 1 });
        }
      });
    }
    updatedCarts[selectedCart] = cartItems;
    setCartDialogOpen(false);
    setTimeout(() => {
      setSnackbar({ open: true, message: '🎉 Added to cart! Ready to checkout or keep shopping?', severity: 'success' });
    }, 200);
    saveCarts(updatedCarts);
    setCartUpdated(true);
    setAddBothToCart(false);
  };

  // Helper to get next available cart name
  const getNextCartName = (cartsObj) => {
    const existing = Object.keys(cartsObj || {});
    let i = 1;
    while (existing.includes(`Cart ${i}`)) i++;
    return `Cart ${i}`;
  };

  // When opening cart dialog, pre-fill new cart name
  const handleOpenCartDialog = () => {
    setCartDialogOpen(true);
    if (!selectedCart && Object.keys(carts).length === 0) {
      setNewCartName(getNextCartName(carts));
    }
  };

  const createNewCart = () => {
    let name = newCartName.trim();
    if (!name) {
      name = getNextCartName(carts);
      setNewCartName(name);
    }
    if (!name || carts[name]) return;
    const updatedCarts = { ...carts, [name]: [] };
    saveCarts(updatedCarts);
    setSelectedCart(name);
    setNewCartName("");
  };

  const handlePlaceBid = () => {
    if (parseInt(bidAmount) >= product.auctionDetails.minimumBid) {
      setBidPlaced(true);
      setBidDialogOpen(false);
      setBidAmount('');
    }
  };

  // Add a scrollToTop handler
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
      const exists = updatedWishlists[wishlistName].some((item) => item.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions));
      if (!exists) {
        updatedWishlists[wishlistName].push({ ...product, selectedOptions: { ...selectedOptions } });
      }
    });
  
    setWishlistDialogOpen(false);
    setTimeout(() => {
      setSnackbar({ open: true, message: '💖 Added to wishlist! Hope you get it soon!', severity: 'success' });
    }, 200);
    saveWishlists(updatedWishlists);
  };
  
  const createNewWishlist = () => {
    if (!newWishlistName.trim() || wishlists[newWishlistName]) return;
  
    const updatedWishlists = { ...wishlists, [newWishlistName]: [] };
    saveWishlists(updatedWishlists);
    setSelectedWishlists([...selectedWishlists, newWishlistName]);
    setNewWishlistName("");
  };
  

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Box component={Paper} elevation={0} sx={{ width: '100%', padding: { xs: 2, sm: 4, md: 8, lg: 12 }, bgcolor: theme.palette.background.paper, borderRadius: { xs: 0, md: 3 } }}>
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
                {product.images && product.images.length > 0 ? (
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
                ) : (
                  <Box sx={{ width: '100%', maxWidth: 500, aspectRatio: '1/1', minHeight: { xs: 220, sm: 320 }, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
                    <Typography variant="body1" color="text.secondary">No images available</Typography>
                  </Box>
                )}
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

              {/* Product Details and Quick Info */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Product Title and Basic Info */}
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0 }}>
                    {product.category} • {product.brand}
                  </Typography>
                  {/* Product Options */}
                  {product.options && (
                    <Box sx={{ mb: 2, mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {Object.entries(product.options).map(([optionKey, optionVals]) => (
                        <Box key={optionKey} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="subtitle2" sx={{ minWidth: 70 }}>{optionKey.charAt(0).toUpperCase() + optionKey.slice(1)}:</Typography>
                          {optionKey === 'color' ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {optionVals.map((color) => (
                                <Box
                                  key={color}
                                  onClick={() => handleOptionSelect(optionKey, color)}
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    border: selectedOptions[optionKey] === color ? '3px solid #1976d2' : '1.5px solid #ccc',
                                    background: color.toLowerCase(),
                                    cursor: 'pointer',
                                    boxShadow: selectedOptions[optionKey] === color ? '0 0 0 2px #90caf9' : 'none',
                                    transition: 'border 0.2s, box-shadow 0.2s',
                                    mr: 0.5
                                  }}
                                  title={color}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {optionVals.map((val) => (
                                <Chip
                                  key={val}
                                  label={val}
                                  clickable
                                  color={selectedOptions[optionKey] === val ? 'primary' : 'default'}
                                  onClick={() => handleOptionSelect(optionKey, val)}
                                  sx={{ fontWeight: 500 }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mt: 0,
                  }}>
                    <Rating value={product.rating} precision={0.5} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({product.rating} / 5)
                    </Typography>
                  </Box>
                </Box>

                {/* Price Box */}
                <Box sx={{ 
                  p: 0,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  mt: -2,
                  mb: -3
                }}>
                  {product.isAuction ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          Current Bid: ₹{product.auctionDetails.currentBid.toLocaleString('en-IN')}
                        </Typography>
                        <Chip 
                          label={`${product.auctionDetails.bids} bids`} 
                          color="primary" 
                          variant="outlined" 
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Min Bid: ₹{product.auctionDetails.minimumBid.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time Left: {product.auctionDetails.timeLeft}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        ₹{product.price.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Inclusive of all taxes
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Condensed Seller Info */}
                {sellerDetails && (
                  <Box sx={{ 
                    p: 1, 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          Sold by {sellerDetails.name}
                        </Typography>
                        {sellerDetails.verificationStatus === "verified" && (
                          <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating value={sellerDetails.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          ({sellerDetails.rating})
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShippingIcon color="action" sx={{ fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Ships in {sellerDetails.shippingTime}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Quick Info Box */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  mt: -2,
                  mb: 1
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
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  {product.isAuction ? (
                    <>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setBidDialogOpen(true)}
                        sx={{ 
                          flex: 1,
                          py: 1.5,
                          textTransform: 'none',
                          fontSize: '1rem'
                        }}
                      >
                        Bid for Auction
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
                        disabled={!allOptionsSelected}
                      >
                        Add to Wishlist
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleOpenCartDialog}
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
                        disabled={!allOptionsSelected}
                      >
                        Add to Wishlist
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Detailed Information Accordions */}
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 7 } }}>
              {/* Product Details (Key Features) */}
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                  Key Features
                </Typography>
                <Grid container spacing={2}>
                  {product.features.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, pl: 1 }}>
                        <CheckCircleOutlineIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{feature}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Divider sx={{ my: 3, bgcolor: 'divider', opacity: 0.5 }} />

              {/* Description */}
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                  {product.description}
                </Typography>
              </Box>
              <Divider sx={{ my: 3, bgcolor: 'divider', opacity: 0.5 }} />

              {/* Seller Information */}
              {sellerDetails && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                    Seller Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight="medium">
                          {sellerDetails.name}
                        </Typography>
                        {sellerDetails.verificationStatus === "verified" && (
                          <VerifiedIcon color="primary" sx={{ fontSize: 20 }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={sellerDetails.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ({sellerDetails.rating})
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {sellerDetails.badges.map((badge, index) => (
                        <Chip
                          key={index}
                          label={badge}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            transition: 'background 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'white',
                            },
                          }}
                        />
                      ))}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon color="action" sx={{ fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {sellerDetails.businessHours}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalShippingIcon color="action" sx={{ fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            Ships in {sellerDetails.shippingTime}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon color="action" sx={{ fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {sellerDetails.location}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {sellerDetails.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Response Time: {sellerDetails.customerSupport.responseTime}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Contact Details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {sellerDetails.customerSupport.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {sellerDetails.customerSupport.phone}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
              {sellerDetails && <Divider sx={{ my: 3, bgcolor: 'divider', opacity: 0.5 }} />}

              {/* FAQ Section */}
              {product.faqs && product.faqs.length > 0 && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                    Frequently Asked Questions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {product.faqs.map((faq, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 0.5 }}>
                          Q{idx + 1}. {faq.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {faq.answer}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {product.faqs && product.faqs.length > 0 && <Divider sx={{ my: 3, bgcolor: 'divider', opacity: 0.5 }} />}

              {/* Reviews Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Typography variant="h5" fontWeight="bold">Customer Reviews</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={product.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({product.reviews?.length || 0} reviews)
                    </Typography>
                  </Box>
                  {/* Review summary */}
                  <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 2 }}>
                    {product.rating} out of 5, {product.reviews?.length || 0} reviews
                  </Typography>
                  <Button variant="outlined" color="primary" sx={{ ml: 'auto', textTransform: 'none', fontWeight: 500 }}>
                    Write a Review
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {product.reviews?.map((review, idx) => (
                    <Box key={review.id} sx={{
                      position: 'relative',
                      pb: 3,
                      bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : (idx % 2 === 0 ? theme.palette.background.default : 'grey.50'),
                      borderRadius: 2,
                      px: 2,
                      pt: 2,
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {review.userName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {review.userName}
                              {review.verified && (
                                <Chip
                                  icon={<VerifiedIcon />}
                                  label="Verified Purchase"
                                  size="small"
                                  color="primary"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(review.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {review.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {review.comment}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Usually Bought Together */}
            {boughtTogether.length > 0 && (
              <Paper elevation={4} sx={{ mt: 6, p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: theme.palette.background.paper, boxShadow: 3, maxWidth: 700, mx: 'auto' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, color: theme.palette.primary.main, textAlign: 'center' }}>
                  Frequently Bought Together
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    width: '100%',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  }}
                >
                  {/* Product 1 */}
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={scrollToTop}>
                    <Box sx={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 160, maxWidth: 200, bgcolor: theme.palette.background.default, borderRadius: 3, boxShadow: 1, p: 2, border: `1px solid ${theme.palette.divider}`, transition: 'box-shadow 0.2s', cursor: 'pointer',
                      '&:hover': { boxShadow: 4, borderColor: theme.palette.primary.light },
                    }}>
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.name}
                        sx={{ width: 80, height: 80, objectFit: 'contain', mb: 1 }}
                      />
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          textAlign: 'center',
                          mb: 0.5,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '2.8em',
                          maxHeight: '2.8em',
                          lineHeight: 1.4,
                          fontSize: '1rem',
                          color: theme.palette.text.primary,
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{product.price.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Link>
                  {/* Plus Icon */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1 }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">+</Typography>
                  </Box>
                  {/* Product 2 */}
                  <Link to={`/product/${boughtTogether[0].id}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={scrollToTop}>
                    <Box sx={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 160, maxWidth: 200, bgcolor: theme.palette.background.default, borderRadius: 3, boxShadow: 1, p: 2, border: `1px solid ${theme.palette.divider}`, transition: 'box-shadow 0.2s', cursor: 'pointer',
                      '&:hover': { boxShadow: 4, borderColor: theme.palette.primary.light },
                    }}>
                      <CardMedia
                        component="img"
                        image={boughtTogether[0].image}
                        alt={boughtTogether[0].name}
                        sx={{ width: 80, height: 80, objectFit: 'contain', mb: 1 }}
                      />
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          textAlign: 'center',
                          mb: 0.5,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '2.8em',
                          maxHeight: '2.8em',
                          lineHeight: 1.4,
                          fontSize: '1rem',
                          color: theme.palette.text.primary,
                        }}
                      >
                        {boughtTogether[0].name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{boughtTogether[0].price.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
                {/* Total and Button below */}
                <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: theme.palette.background.default, borderRadius: 3, textAlign: 'center', boxShadow: 'none' }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: theme.palette.primary.dark, fontSize: '1.2rem' }}>
                    Total: ₹{(product.price + boughtTogether[0].price).toLocaleString('en-IN')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { setAddBothToCart(true); handleOpenCartDialog(); }}
                    sx={{ px: 4, py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 2, boxShadow: 2, mt: 1, letterSpacing: 0.5 }}
                  >
                    Add Both to Cart
                  </Button>
                </Paper>
              </Paper>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: theme.palette.text.primary }}>
                  Related Products
                </Typography>
                <Grid container spacing={3}>
                  {relatedProducts.slice(0, visibleRelatedCount).map((relatedProduct) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={relatedProduct.id}>
                      <Card 
                        component={Link} 
                        to={`/product/${relatedProduct.id}`}
                        onClick={scrollToTop}
                        sx={{ 
                          textDecoration: 'none',
                          height: 380,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          transition: 'transform 0.2s',
                          bgcolor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          '&:hover': { transform: 'translateY(-4px)' },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={relatedProduct.image}
                          alt={relatedProduct.name}
                          sx={{ 
                            width: '100%',
                            height: 180,
                            objectFit: 'contain',
                            p: 2,
                            mb: 1,
                            bgcolor: theme.palette.background.default,
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1, width: '100%', p: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ color: theme.palette.text.primary }}>
                            {relatedProduct.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {relatedProduct.brand}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={relatedProduct.rating} precision={0.5} readOnly size="small" />
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
                {visibleRelatedCount < relatedProducts.length && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="outlined" onClick={() => setVisibleRelatedCount(c => c + 8)}>
                      Show More
                    </Button>
                  </Box>
                )}
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
        >
          <DialogTitle sx={{ 
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <ShoppingCartIcon />
            Add to Cart
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ 
              mb: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2
            }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
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

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Select Cart
            </Typography>
            <Box sx={{ 
              maxHeight: 200, 
              overflow: 'auto',
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2,
              mb: 2
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
                  placeholder={getNextCartName(carts)}
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
              sx={{mt: 1}}
            >
              Cancel
            </Button>
            <Button 
              onClick={addToSelectedCart} 
              variant="contained"
              color="primary"
              disabled={!selectedCart}
              sx={{mt: 1}}
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
        >
          <DialogTitle sx={{ 
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <FavoriteIcon />
            Add to Wishlist
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ 
              mb: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2
            }}>
              <Typography variant="h6" gutterBottom sx={{mt: 1}}>
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

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Select Wishlists
            </Typography>
            <Box sx={{ 
              maxHeight: 200, 
              overflow: 'auto',
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2,
              mb: 2
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
            pt: 1, 
            bgcolor: 'background.paper', 
            borderTop: '1px solid', 
            borderColor: 'divider',
            gap: 1,
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
                  bgcolor: 'action.hover',
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
                  bgcolor: 'secondary.dark',
                }
              }}
            >
              Add to Wishlist
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionProps={{
            appear: true,
            onEnter: (node) => {
              node.style.opacity = 0;
              node.style.transform = 'translateY(40px)';
              setTimeout(() => {
                node.style.transition = 'opacity 400ms cubic-bezier(0.4,0,0.2,1), transform 400ms cubic-bezier(0.4,0,0.2,1)';
                node.style.opacity = 1;
                node.style.transform = 'translateY(0)';
              }, 10);
            },
            onExit: (node) => {
              node.style.transition = 'opacity 300ms cubic-bezier(0.4,0,0.2,1), transform 300ms cubic-bezier(0.4,0,0.2,1)';
              node.style.opacity = 0;
              node.style.transform = 'translateY(40px)';
            },
          }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              bgcolor: '#fff',
              color: '#222',
              border: '1px solid #eee',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: 6,
              borderRadius: 3,
              px: 3,
              py: 2,
              transition: 'box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s cubic-bezier(0.4,0,0.2,1)',
              letterSpacing: 0.2,
            }}
            icon={false}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </>
  );
};

export default ProductDetails;