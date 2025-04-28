import React, { useState } from "react";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount = 0, selectedCarts = [] } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [dialogType, setDialogType] = useState("");

  // Order Saving
  const saveOrderToLocalStorage = () => {
    const allItems = selectedCarts.flatMap((cart) => cart.items);
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      total: totalAmount,
      status: "Confirmed",
      items: allItems,
    };
    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
  };

  const handleOpenDialog = () => {
    if (paymentMethod === "card") {
      const { cardNumber, expiry, cvv } = cardDetails;
      if (cardNumber.length < 12 || !expiry || cvv.length < 3) {
        alert("Please fill in valid card details.");
        return;
      }
      setDialogType("otp");
    } else if (paymentMethod === "upi") {
      if (!upiId.includes("@")) {
        alert("Please enter a valid UPI ID.");
        return;
      }
      setDialogType("upi");
    } else if (paymentMethod === "paypal") {
      if (!paypalEmail.includes("@") || !paypalEmail.includes(".")) {
        alert("Please enter a valid PayPal email.");
        return;
      }
      setDialogType("paypal");
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setOtp("");
  };

  const handleOTPSubmit = () => {
    if (otp === "123456") {
      alert("Payment Successful!");
      saveOrderToLocalStorage();
      navigate("/thank-you");
    } else {
      alert("Invalid OTP!");
    }
    handleDialogClose();
  };

  const handleUPISuccess = () => {
    alert("Redirecting to UPI App...");
    handleDialogClose();
    setTimeout(() => {
      saveOrderToLocalStorage();
      navigate("/thank-you");
    }, 1500);
  };

  const handlePaypalSuccess = () => {
    alert("PayPal payment successful!");
    handleDialogClose();
    saveOrderToLocalStorage();
    navigate("/thank-you");
  };

  return (
    <>
      <Navbar sx={{ mb: '10px' }} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, pb: 8 }}>
        <Paper elevation={4} sx={{ p: 4, width: 400, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Payment Gateway
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Total Amount: ₹{totalAmount.toFixed(2)}
          </Typography>

          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
            <FormControlLabel value="upi" control={<Radio />} label="UPI" />
            <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
          </RadioGroup>

          {paymentMethod === "card" && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Card Number"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                fullWidth
              />
              <TextField
                label="Expiry Date"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                fullWidth
              />
              <TextField
                label="CVV"
                type="password"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                fullWidth
              />
            </Box>
          )}

          {paymentMethod === "upi" && (
            <TextField
              label="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              sx={{ mt: 2 }}
              fullWidth
            />
          )}

          {paymentMethod === "paypal" && (
            <TextField
              label="PayPal Email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              sx={{ mt: 2 }}
              fullWidth
            />
          )}

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4, width: "100%" }}
            onClick={handleOpenDialog}
          >
            Pay Now
          </Button>
        </Paper>

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          {dialogType === "otp" ? (
            <>
              <DialogTitle>Enter OTP</DialogTitle>
              <DialogContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  An OTP has been sent to your registered mobile number.
                </Typography>
                <TextField
                  label="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleOTPSubmit} variant="contained">
                  Submit OTP
                </Button>
              </DialogActions>
            </>
          ) : dialogType === "upi" ? (
            <>
              <DialogTitle>Redirect to UPI App</DialogTitle>
              <DialogContent>
                <Typography variant="body2">
                  Please complete the payment using your UPI app (GPay, PhonePe, etc.).
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleUPISuccess} variant="contained">
                  Done
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <DialogTitle>PayPal Payment</DialogTitle>
              <DialogContent>
                <Typography variant="body2">
                  Redirecting to PayPal... (simulated)
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handlePaypalSuccess} variant="contained">
                  Payment Successful
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
      <Footer />
    </>
  );
};

export default PaymentGateway;
