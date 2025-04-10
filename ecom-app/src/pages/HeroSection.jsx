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
} from "@mui/material";
import { styled } from "@mui/system";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';

const BannerBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
  borderRadius: 24,
  boxShadow: theme.shadows[2],
  margin: "0 auto",
  maxWidth: "1400px",
  [theme.breakpoints.down('sm')]: {
    height: 400,
    borderRadius: 16,
  },
}));

const BannerImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 1s ease-in-out",
  position: "absolute",
  borderRadius: "inherit",
});

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  color: "white",
  padding: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  boxShadow: theme.shadows[1],
  borderRadius: 16,
  transition: "all 0.3s ease",
  overflow: "hidden",
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const CategoryOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  padding: theme.spacing(2),
  background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  textTransform: "uppercase",
}));

const HeroSection = () => {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads]);

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const handleCategoryClick = (category) => {
    window.scrollTo(0, 0);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.default" }}>
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
              <BannerImage
                src={ads[currentIndex].image}
                alt={ads[currentIndex].title}
              />
              <Overlay>
                <Box sx={{ maxWidth: "600px" }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {ads[currentIndex].title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                      lineHeight: 1.4,
                      opacity: 0.9,
                      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    {ads[currentIndex].description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      px: 5,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    Shop Now
                  </Button>
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
              borderRadius: "50%",
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
                  color: index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  "&:hover": { color: "white" },
                  transition: "all 0.2s ease",
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        </BannerBox>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          Shop by Category
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={3} key={category.name}>
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
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: "background.paper", py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 3,
                }}
              >
                <LocalOfferIcon sx={{ fontSize: 32, color: "primary.main" }} />
                <Typography variant="h6" fontWeight="bold">
                  Best Deals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find the best prices and exclusive offers
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 3,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 32, color: "primary.main" }} />
                <Typography variant="h6" fontWeight="bold">
                  Trending Now
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Discover what's hot and new
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 3,
                }}
              >
                <StarIcon sx={{ fontSize: 32, color: "primary.main" }} />
                <Typography variant="h6" fontWeight="bold">
                  Top Rated
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Shop with confidence from top sellers
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          Ready to Start Shopping?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
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
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontSize: "1rem",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 8px rgba(0,0,0,0.2)",
            },
          }}
        >
          Explore Now
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
