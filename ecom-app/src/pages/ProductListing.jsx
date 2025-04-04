import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [],
    brand: [],
    rating: [],
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryFromURL = searchParams.get("category") || "";
  const productContainerRef = useRef(null);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        applyFilters(data, filters, searchQuery, categoryFromURL);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchQuery, categoryFromURL]);

  const applyFilters = (data, filters, searchQuery, categoryFromURL) => {
    let filtered = data.filter((product) =>
      product.name.toLowerCase().includes(searchQuery)
    );

    if (categoryFromURL)
      filtered = filtered.filter(
        (product) => product.category === categoryFromURL
      );

    if (filters.category.length) {
      filtered = filtered.filter((product) =>
        filters.category.includes(product.category)
      );
    }

    if (filters.priceRange.length) {
      filtered = filtered.filter((product) => {
        return filters.priceRange.some((range) => {
          if (range === "low") return product.price < 500;
          if (range === "medium")
            return product.price >= 500 && product.price <= 2000;
          if (range === "high") return product.price > 2000;
          return false;
        });
      });
    }

    if (filters.brand.length) {
      filtered = filtered.filter((product) =>
        filters.brand.includes(product.brand)
      );
    }

    if (filters.rating.length) {
      filtered = filtered.filter((product) =>
        filters.rating.some((rating) => product.rating >= parseFloat(rating))
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters(products, filters, searchQuery, categoryFromURL);
  }, [filters, products, searchQuery, categoryFromURL]);

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const newValues = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];

      return { ...prevFilters, [filterType]: newValues };
    });
  };

  const filterGroups = [
    { title: "Category", options: ["Electronics", "Clothing", "Home"], type: "category" },
    { title: "Brand", options: ["Apple", "Nike", "Samsung"], type: "brand" },
    { title: "Rating", options: ["4 & Above", "3 & Above", "2 & Above"], type: "rating" }
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        minHeight: "100vh",
        bgcolor: isDarkMode ? "background.default" : "#fff",
        color: "text.primary",
      }}
    >
      {/* Filter Sidebar / Topbar */}
      <Box
        sx={{
          width: { xs: "100%", sm: "280px" },
          flexShrink: 0,
          borderRight: { sm: `1px solid ${isDarkMode ? "#444" : "#ddd"}` },
          borderBottom: { xs: `1px solid ${isDarkMode ? "#444" : "#ddd"}`, sm: "none" },
          bgcolor: isDarkMode ? "background.paper" : "#fff",
          p: 2,
          maxHeight: { xs: "auto", sm: "calc(100vh - 80px)" },
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold", fontSize: "1rem", color: "text.primary" }}
        >
          Filters
        </Typography>

        {filterGroups.map(({ title, options, type }) => (
          <Box key={type} sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: "bold",
                mb: 1,
                color: "text.primary",
              }}
            >
              {title}
            </Typography>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={filters[type].includes(option)}
                    onChange={() => handleCheckboxChange(type, option)}
                    sx={{
                      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "#333",
                      "&.Mui-checked": {
                        color: isDarkMode ? "#90caf9" : "#1976d2",
                      },
                    }}
                  />
                }
                label={option}
                sx={{
                  display: "block",
                  mb: 1,
                  fontSize: "0.8rem",
                  color: "text.primary",
                }}
              />
            ))}
          </Box>
        ))}
      </Box>

      {/* Product Grid */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, fontSize: "1rem", color: "text.primary" }}
        >
          {filteredProducts.length} results found for "
          {searchQuery || categoryFromURL || "All Products"}"
        </Typography>

        <Box ref={productContainerRef}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : filteredProducts.length > 0 ? (
            <Grid container spacing={2}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: isDarkMode ? "background.paper" : "#fff",
                        boxShadow: isDarkMode ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
                        "&:hover": {
                          boxShadow: isDarkMode ? 2 : "0 4px 8px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.name}
                        sx={{
                          width: "100%",
                          height: "160px",
                          objectFit: "contain",
                          p: 1,
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", color: "text.secondary" }}
                        >
                          ₹{product.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          ⭐ {product.rating} / 5
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                mt: 3,
                fontSize: "1rem",
                color: "text.secondary",
              }}
            >
              Nothing found.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default ProductListing;