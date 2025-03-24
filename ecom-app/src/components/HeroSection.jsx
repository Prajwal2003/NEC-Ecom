import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardMedia, CardContent, Grid } from "@mui/material";
import { styled } from "@mui/system";

// Styled components
const BannerBox = styled(Box)({
  width: "100%",
  height: 400,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
});

const BannerImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 10,
  transition: "opacity 1s ease-in-out",
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

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads]);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.default", p: 2 }}>
      {/* Banner Section */}
      <BannerBox>
        {ads.length > 0 && <BannerImage src={ads[currentIndex].image} alt={ads[currentIndex].title} />}
      </BannerBox>

      {/* Categories Section */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={3} key={category.name}>
              <Card
                sx={{
                  cursor: "pointer",
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HeroSection;
