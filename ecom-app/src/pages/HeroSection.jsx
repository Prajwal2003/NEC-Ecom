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
} from "@mui/material";
import { styled } from "@mui/system";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const BannerBox = styled(Box)({
  width: "100%",
  height: 450,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
  borderRadius: 10,
});

const BannerImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 1s ease-in-out",
  position: "absolute",
  borderRadius: 10,
});

const Overlay = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  textAlign: "center",
  padding: "20px",
});

const DotsContainer = styled(Box)({
  position: "absolute",
  bottom: 15,
  display: "flex",
  justifyContent: "center",
  width: "100%",
});

const CategoryCard = styled(Card)({
  cursor: "pointer",
  boxShadow: 4,
  borderRadius: 2,
  transition: "transform 0.3s, box-shadow 0.3s",
  overflow: "hidden",
  position: "relative",
  "&:hover": {
    transform: "scale(1.08)",
    boxShadow: 8,
  },
});

const CategoryOverlay = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.3rem",
  textTransform: "uppercase",
  padding: "10px",
});

const HeroSection = () => {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

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

  const handleCategoryClick = (category) => {
    window.scrollTo(0, 0);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <Box sx={{ width: "100%" ,bgcolor: "background.default", p: 2 }}>
      <BannerBox>
        {ads.length > 0 && (
          <>
            <BannerImage src={ads[currentIndex].image} alt={ads[currentIndex].title} />
          </>
        )}
        <DotsContainer>
          {ads.map((_, index) => (
            <FiberManualRecordIcon
              key={index}
              fontSize="small"
              sx={{ color: index === currentIndex ? "white" : "gray", mx: 0.5 }}
            />
          ))}
        </DotsContainer>
      </BannerBox>

      <Box sx={{ textAlign: "center", mt: 4, width: "100%" }}>
        {/* Heading */}
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          margin={5}
          sx={{
            fontSize: { xs: "1.3rem", sm: "1.5rem", md: "2rem" },
            color: "text.primary",
          }}
        >
          Shop by <span style={{ color: "primary.main" }}>Category</span>
        </Typography>

        {/* Category Grid */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{ width: "100%", maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 4, md: 6 } }}
        >
          {categories.map((category) => (
            <Grid item xs={6} sm={3} md={3} key={category.name}>
              <Box
                onClick={() => handleCategoryClick(category.name)}
                sx={{
                  width: "100%",
                  maxWidth: { xs: 120, sm: 150, md: 180 },
                  height: { xs: 120, sm: 150, md: 180 },
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  backgroundColor: "background.paper",
                  boxShadow: 2,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: 4,
                  },
                  mx: "auto",
                }}
              >
                {/* Category Image */}
                <CardMedia
                  component="img"
                  image={category.image}
                  alt={category.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    filter: "brightness(0.85)",
                  }}
                />

                {/* Overlay with Category Name */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
                    textTransform: "capitalize",
                    textAlign: "center",
                    px: 1,
                  }}
                >
                  {category.name}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>


      <Container sx={{ textAlign: "center", mt: 6, py: 5 }}>
        <Box
          sx={{
            width: "100%",
            height: "1px",
            bgcolor: "#ddd",
            mb: 4,
          }}
        />
        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
          Exclusive Deals & Limited Time Offers
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: "auto", color: "text.secondary" }}>
          Uncover the best discounts on top products. Act fast, these deals won't last forever!
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
          Browse Deals
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
