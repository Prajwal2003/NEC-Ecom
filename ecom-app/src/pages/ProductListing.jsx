import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    brand: "",
    rating: "",
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryFromURL = searchParams.get("category") || "";
  const theme = useTheme();

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        // If a category is present in the URL and no search query, filter by category
        if (categoryFromURL && !searchQuery) {
          setFilters((prev) => ({ ...prev, category: categoryFromURL }));
          applyFilters(data, { ...filters, category: categoryFromURL }, searchQuery);
        } else {
          applyFilters(data, filters, searchQuery);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, [searchQuery, categoryFromURL]);

  const applyFilters = (data, filters, searchQuery) => {
    let filtered = data.filter((product) =>
      product.name.toLowerCase().includes(searchQuery)
    );

    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category);
    }
    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        if (filters.priceRange === "low") return product.price < 500;
        if (filters.priceRange === "medium") return product.price >= 500 && product.price <= 2000;
        if (filters.priceRange === "high") return product.price > 2000;
        return true;
      });
    }
    if (filters.brand) {
      filtered = filtered.filter((product) =>
        product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    if (filters.rating) {
      filtered = filtered.filter((product) => product.rating >= parseFloat(filters.rating));
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters(products, filters, searchQuery);
  }, [filters, products, searchQuery]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ padding: 3, bgcolor: "background.default", color: "text.primary" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : categoryFromURL
          ? `Category: ${categoryFromURL}`
          : "All Products"}
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 3,
          bgcolor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: 1,
        }}
      >
        {[
          { label: "Category", name: "category", options: ["Electronics", "Clothing", "Home"] },
          { label: "Price", name: "priceRange", options: ["low", "medium", "high"], values: ["Below ₹500", "₹500 - ₹2000", "Above ₹2000"] },
          { label: "Brand", name: "brand", options: ["Apple", "Nike", "Samsung"] },
          { label: "Rating", name: "rating", options: ["4", "3", "2"], values: ["4 & Above", "3 & Above", "2 & Above"] },
        ].map(({ label, name, options, values }, index) => (
          <Box key={index}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: "bold" }}>{label}</Typography>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select name={name} value={filters[name]} onChange={handleFilterChange} displayEmpty>
                <MenuItem value="">All</MenuItem>
                {options.map((option, idx) => (
                  <MenuItem key={option} value={option}>
                    {values ? values[idx] : option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>

      {/* Loading & Product List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card
                sx={{
                  display: "flex",
                  padding: 2,
                  boxShadow: 2,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ width: 100, height: 100, objectFit: "contain", mr: 2, borderRadius: 1 }}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">{product.category} • {product.brand}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>₹{product.price}</Typography>
                  <Typography variant="body2" color="secondary">⭐ {product.rating} / 5</Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      ) : (
        <Typography sx={{ textAlign: "center", mt: 3, fontSize: "1.2rem", color: "gray" }}>
          No products found.
        </Typography>
      )}
    </Box>
  );
};

export default ProductListing;
