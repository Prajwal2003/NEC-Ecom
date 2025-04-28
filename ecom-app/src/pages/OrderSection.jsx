import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import profileData from "../../public/data/profile.json";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);
  

  return (
    <>
      <Navbar sx={{ mb: '10px' }} />
      <Box sx={{ p: 3, mt: '100px' }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          My Orders
        </Typography>

        {orders.map((order) => (
          <Accordion key={order.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1">
                    Order ID: {order.id}
                  </Typography>
                  <Chip label={order.status} color="success" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Date: {order.date} | Total: ₹{order.total}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {order.items.map((item, index) => (
                <Card key={index} sx={{ display: "flex", mb: 1 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, objectFit: "contain" }}
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ₹{item.price}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                Delivery Address: {profileData.addresses[0].address}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Footer />
    </>
  );
};

export default OrdersPage;
