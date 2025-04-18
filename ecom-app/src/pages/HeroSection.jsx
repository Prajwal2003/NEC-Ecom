import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Grid,
  Button,
  Container,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Stack,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';

// Color scheme with dark theme support
const colors = {
  primary: {
    light: '#2563eb',
    dark: '#3b82f6',
  },
  secondary: {
    light: '#f59e0b',
    dark: '#fbbf24',
  },
  background: {
    light: '#f8fafc',
    dark: '#0f172a',
  },
  text: {
    light: '#1e293b',
    dark: '#f1f5f9',
  },
  border: {
    light: '#e2e8f0',
    dark: '#1e293b',
  },
  hover: {
    light: '#1d4ed8',
    dark: '#60a5fa',
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },
};

const BannerBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 450,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
  margin: "0 auto",
  maxWidth: "1400px",
  backgroundColor: theme.palette.mode === 'dark' ? colors.background.dark : colors.primary.light,
  borderRadius: "24px",
  boxShadow: theme.palette.mode === 'dark' 
    ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  [theme.breakpoints.down('sm')]: {
    height: 350,
    borderRadius: "16px",
  },
}));

const BannerImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 0.5s ease-in-out",
  position: "absolute",
  borderRadius: "inherit",
});

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  background: `linear-gradient(to bottom, 
    ${theme.palette.mode === 'dark' ? colors.overlay.dark : colors.overlay.light} 0%, 
    ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)'} 50%, 
    ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 100%
  )`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  color: "white",
  padding: theme.spacing(6),
  borderRadius: "inherit",
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  boxShadow: "none",
  borderRadius: "16px",
  transition: "all 0.3s ease",
  overflow: "hidden",
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.mode === 'dark' ? colors.background.dark : 'white',
  border: `1px solid ${theme.palette.mode === 'dark' ? colors.border.dark : colors.border.light}`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.palette.mode === 'dark'
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderColor: theme.palette.mode === 'dark' ? colors.primary.dark : colors.primary.light,
  },
}));

const CategoryOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  padding: theme.spacing(2),
  background: "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "0.9rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  borderRadius: "16px",
  backgroundColor: theme.palette.mode === 'dark' ? colors.background.dark : 'white',
  border: `1px solid ${theme.palette.mode === 'dark' ? colors.border.dark : colors.border.light}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.palette.mode === 'dark'
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderColor: theme.palette.mode === 'dark' ? colors.primary.dark : colors.primary.light,
  },
}));

const HeroSection = () => {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetch("/ads.json")
      .then((res) => res.json())
      .then((data) => setAds(data))
      .catch((err) => console.error("Error loading ads:", err));

    fetch("/categories.json")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
        setFadeIn(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads]);

  const handlePrevSlide = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
      setFadeIn(true);
    }, 500);
  };

  const handleNextSlide = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      setFadeIn(true);
    }, 500);
  };

  const handleCategoryClick = (category) => {
    window.scrollTo(0, 0);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <Box sx={{ 
      width: "100%", 
      bgcolor: theme => theme.palette.mode === 'dark' ? colors.background.dark : colors.background.light 
    }}>
      {/* Hero Banner Section */}
      <Box sx={{ 
        position: "relative", 
        mb: 6,
        px: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 2, sm: 3, md: 4 }
      }}>
        <BannerBox>
          {ads.length > 0 && (
            <>
              <Fade in={fadeIn} timeout={500}>
                <BannerImage
                  src={ads[currentIndex].image}
                  alt={ads[currentIndex].title}
                />
              </Fade>
              <Overlay>
                <Box sx={{ maxWidth: "600px" }}>
                  <Fade in={fadeIn} timeout={500} style={{ transitionDelay: '100ms' }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        color: "#fff",
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {ads[currentIndex].title}
                    </Typography>
                  </Fade>
                  <Fade in={fadeIn} timeout={500} style={{ transitionDelay: '200ms' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                        lineHeight: 1.4,
                        color: "#fff",
                        opacity: 0.9,
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {ads[currentIndex].description}
                    </Typography>
                  </Fade>
                  <Fade in={fadeIn} timeout={500} style={{ transitionDelay: '300ms' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<ShoppingBagIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        fontSize: "1rem",
                        textTransform: "none",
                        fontWeight: 600,
                        backgroundColor: theme => theme.palette.mode === 'dark' ? colors.secondary.dark : colors.primary.light,
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        "&:hover": {
                          backgroundColor: theme => theme.palette.mode === 'dark' ? '#d97706' : colors.hover.light,
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 8px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06)",
                        },
                      }}
                    >
                      Shop Now
                    </Button>
                  </Fade>
                </Box>
              </Overlay>
            </>
          )}
          
          {/* Navigation Arrows */}
          <IconButton
            onClick={handlePrevSlide}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255, 255, 255, 0.9)",
              "&:hover": { bgcolor: "white" },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderRadius: "50%",
              width: 48,
              height: 48,
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNextSlide}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255, 255, 255, 0.9)",
              "&:hover": { bgcolor: "white" },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderRadius: "50",
              width: 48,
              height: 48,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          {/* Dots Indicator */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {ads.map((_, index) => (
              <FiberManualRecordIcon
                key={index}
                sx={{
                  fontSize: 10,
                  color: index === currentIndex ? colors.secondary.light : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  "&:hover": { color: colors.secondary.dark },
                  transition: "all 0.2s ease",
                }}
                onClick={() => {
                  setFadeIn(false);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setFadeIn(true);
                  }, 500);
                }}
              />
            ))}
          </Box>
        </BannerBox>
      </Box>

      {/* Quick Categories */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: theme => theme.palette.mode === 'dark' ? colors.text.dark : colors.text.light,
            textAlign: "center",
          }}
        >
          Shop by Category
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={3} key={category.name}>
              <Grow in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                <CategoryCard onClick={() => handleCategoryClick(category.name)}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={category.image}
                    alt={category.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CategoryOverlay>
                    {category.name}
                  </CategoryOverlay>
                </CategoryCard>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        bgcolor: theme => theme.palette.mode === 'dark' ? colors.background.dark : 'white',
        py: 6, 
        borderTop: theme => `1px solid ${theme.palette.mode === 'dark' ? colors.border.dark : colors.border.light}` 
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Grow in timeout={500}>
                <FeaturePaper elevation={0}>
                  <LocalShippingIcon sx={{ fontSize: 40, color: colors.primary.light }} />
                  <Typography variant="body1" fontWeight="bold" color={colors.text.light}>
                    Free Shipping
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    On orders over $50
                  </Typography>
                </FeaturePaper>
              </Grow>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Grow in timeout={500} style={{ transitionDelay: '100ms' }}>
                <FeaturePaper elevation={0}>
                  <SecurityIcon sx={{ fontSize: 40, color: colors.primary.light }} />
                  <Typography variant="body1" fontWeight="bold" color={colors.text.light}>
                    Secure Payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    100% secure payment
                  </Typography>
                </FeaturePaper>
              </Grow>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Grow in timeout={500} style={{ transitionDelay: '200ms' }}>
                <FeaturePaper elevation={0}>
                  <FlashOnIcon sx={{ fontSize: 40, color: colors.primary.light }} />
                  <Typography variant="body1" fontWeight="bold" color={colors.text.light}>
                    Fast Delivery
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Within 2-3 days
                  </Typography>
                </FeaturePaper>
              </Grow>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Grow in timeout={500} style={{ transitionDelay: '300ms' }}>
                <FeaturePaper elevation={0}>
                  <StarIcon sx={{ fontSize: 40, color: colors.primary.light }} />
                  <Typography variant="body1" fontWeight="bold" color={colors.text.light}>
                    Best Quality
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quality assured
                  </Typography>
                </FeaturePaper>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Grow in timeout={500}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme => theme.palette.mode === 'dark' ? colors.text.dark : colors.text.light,
                letterSpacing: "-0.02em",
              }}
            >
              Ready to Start Shopping?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "text.secondary",
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Join millions of happy customers who trust us for their shopping needs
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingBagIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "1rem",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: colors.primary.light,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                "&:hover": {
                  backgroundColor: colors.hover.light,
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 8px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06)",
                },
              }}
            >
              Start Shopping
            </Button>
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default HeroSection;
