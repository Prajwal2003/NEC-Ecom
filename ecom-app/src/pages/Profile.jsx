import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import profileData from "../../public/data/profile.json"; // adjust path if needed

const ProfilePage = () => {
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState(profileData.addresses);
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatedName, setUpdatedName] = useState(profileData.profile.name);
  const [updatedPhone, setUpdatedPhone] = useState(profileData.profile.phone);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setSavedAddresses([
        ...savedAddresses,
        { id: savedAddresses.length + 1, address: newAddress },
      ]);
      setNewAddress("");
      setOpenAddressDialog(false);
    }
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter((address) => address.id !== id));
  };

  const handleEditProfile = () => setEditingProfile(true);

  const handleSaveProfile = () => {
    profileData.profile.name = updatedName;
    profileData.profile.phone = updatedPhone;
    setEditingProfile(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", color: "text.primary" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Left: Profile */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              src={profileData.profile.avatar}
              alt="Profile Photo"
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                mx: "auto",
                mb: 2,
              }}
            />
            <CardContent>
              {editingProfile ? (
                <>
                  <TextField
                    fullWidth
                    label="Name"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={updatedPhone}
                    onChange={(e) => setUpdatedPhone(e.target.value)}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h6" fontWeight="bold">
                    {updatedName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {updatedPhone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileData.profile.email}
                  </Typography>
                </>
              )}
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editingProfile ? handleSaveProfile : handleEditProfile}
              >
                {editingProfile ? "Save Changes" : "Edit Profile"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Access Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Orders */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Orders
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  View your past orders and their details.
                </Typography>
                <Button variant="outlined" fullWidth onClick={() => navigate("/orders")}>
                  View Orders
                </Button>
              </Card>
            </Grid>

            {/* Manage Addresses */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Manage Addresses
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Add or delete saved delivery addresses.
                </Typography>
                <Button variant="outlined" fullWidth onClick={() => setOpenAddressDialog(true)}>
                  Add New Address
                </Button>
              </Card>
            </Grid>

            {/* Seller Dashboard */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Seller Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Manage your product listings and track performance.
                </Typography>
                <Button variant="outlined" fullWidth onClick={() => navigate("/seller")}>
                  Go to Seller Panel
                </Button>
              </Card>
            </Grid>

            {/* Wishlist */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Wishlist
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  View your saved items and move them to cart.
                </Typography>
                <Button variant="outlined" fullWidth onClick={() => navigate("/wishlist")}>
                  Go to Wishlist
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Saved Addresses Section */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Saved Addresses
          </Typography>
          <Grid container spacing={2}>
            {savedAddresses.map((address) => (
              <Grid item xs={12} sm={6} md={4} key={address.id}>
                <Card sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">{address.address}</Typography>
                  <IconButton color="error" onClick={() => handleDeleteAddress(address.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Add Address Dialog */}
      <Dialog open={openAddressDialog} onClose={() => setOpenAddressDialog(false)}>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddressDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAddress} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
