import React, { useState, useEffect } from "react";
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
  Divider,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import profileData from "../../public/data/profile.json";  // Make sure to adjust the path if needed

const ProfilePage = () => {
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState(profileData.addresses);
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatedName, setUpdatedName] = useState(profileData.profile.name);
  const [updatedPhone, setUpdatedPhone] = useState(profileData.profile.phone);
  const theme = useTheme();

  const handleAddAddress = () => {
    if (newAddress) {
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

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleSaveProfile = () => {
    profileData.profile.name = updatedName;
    profileData.profile.phone = updatedPhone;
    setEditingProfile(false);
  };

  return (
    <Box
      sx={{
        padding: 3,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 2 }}>
            <Avatar
              src={profileData.profile.avatar}
              alt="Profile Photo"
              sx={{ width: 120, height: 120, marginBottom: 2 }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {editingProfile ? (
                  <TextField
                    fullWidth
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  profileData.profile.name
                )}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {editingProfile ? (
                  <TextField
                    fullWidth
                    value={updatedPhone}
                    onChange={(e) => setUpdatedPhone(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  profileData.profile.phone
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {profileData.profile.email}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                onClick={editingProfile ? handleSaveProfile : handleEditProfile}
              >
                {editingProfile ? "Save Changes" : "Edit Profile"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Order History */}
        <Grid item xs={12} md={8}>
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Order History
            </Typography>
            {profileData.orders.map((order) => (
              <Card key={order.id} sx={{ marginBottom: 2, padding: 2 }}>
                <Typography variant="body1">
                  {order.items.map((item, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                      <Avatar
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 50, height: 50, marginRight: 2 }}
                      />
                      <Box>
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          ${item.price}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Order ID: {order.id} | Date: {order.date} | Status: {order.status}
                  </Typography>
                </Typography>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Saved Addresses */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Saved Addresses
          </Typography>
          {savedAddresses.map((address) => (
            <Card key={address.id} sx={{ display: "flex", padding: 2, marginBottom: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  {address.title} - {address.address}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteAddress(address.id)}
                sx={{ ml: 2 }}
              >
                Delete
              </Button>
            </Card>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              mt: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
              paddingX: 2,
              borderRadius: 2,
              fontWeight: "bold",
            }}
            onClick={() => setOpenAddressDialog(true)}
          >
            Add New Address
          </Button>
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
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddressDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddAddress} color="primary">
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
