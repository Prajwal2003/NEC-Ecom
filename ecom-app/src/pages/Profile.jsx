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
  Tabs,
  Tab,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import profileData from "../../public/data/profile.json";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GavelIcon from "@mui/icons-material/Gavel";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const ProfilePage = () => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatedName, setUpdatedName] = useState(profileData.profile.name);
  const [updatedPhone, setUpdatedPhone] = useState(profileData.profile.phone);
  const [activeTab, setActiveTab] = useState(0);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState(profileData.addresses);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleEditProfile = () => setEditingProfile(true);

  const handleSaveProfile = () => {
    profileData.profile.name = updatedName;
    profileData.profile.phone = updatedPhone;
    setEditingProfile(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  const menuItems = [
    { icon: <PersonIcon />, text: 'Personal Information', path: '/profile' },
    { icon: <ShoppingCartIcon />, text: 'My Carts', path: '/profile/carts' },
    { icon: <FavoriteIcon />, text: 'My Wishlists', path: '/profile/wishlists' },
    { icon: <GavelIcon />, text: 'My Bids', path: '/profile/bids' },
    { icon: <SettingsIcon />, text: 'Settings', path: '/profile/settings' },
  ];

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 4,
        width: '100%'
      }}>
        <PersonIcon fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight="bold">
          My Profile
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left: Profile */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            p: 3, 
            textAlign: "center",
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            height: '100%',
            width: '100%'
          }}>
            <Avatar
              src={profileData.profile.avatar}
              alt="Profile Photo"
              sx={{
                width: { xs: 100, sm: 120, md: 140 },
                height: { xs: 100, sm: 120, md: 140 },
                mx: "auto",
                mb: 2,
                border: `4px solid ${theme.palette.primary.main}`,
              }}
            />
            <CardContent>
              {editingProfile ? (
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={updatedPhone}
                    onChange={(e) => setUpdatedPhone(e.target.value)}
                    size="small"
                  />
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <Typography variant="h5" fontWeight="bold">
                    {updatedName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {updatedPhone}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {profileData.profile.email}
                  </Typography>
                </Stack>
              )}
              <Button
                variant={editingProfile ? "contained" : "outlined"}
                startIcon={editingProfile ? null : <EditIcon />}
                fullWidth
                sx={{ mt: 3 }}
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
              <Card sx={{ 
                p: 3, 
                height: "100%",
                width: '100%',
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <ReceiptIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View your past orders and their details
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate("/orders")}
                  sx={{ mt: 2 }}
                >
                  View Orders
                </Button>
              </Card>
            </Grid>

            {/* Bids */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 3, 
                height: "100%",
                width: '100%',
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <GavelIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      My Bids
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track your active and past bids
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate("/profile/bids")}
                  sx={{ mt: 2 }}
                >
                  View Bids
                </Button>
              </Card>
            </Grid>

            {/* Seller Dashboard */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 3, 
                height: "100%",
                width: '100%',
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <StorefrontIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Seller Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your product listings
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate("/seller")}
                  sx={{ mt: 2 }}
                >
                  Go to Seller Panel
                </Button>
              </Card>
            </Grid>

            {/* Wishlist */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 3, 
                height: "100%",
                width: '100%',
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <FavoriteBorderIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Wishlist
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View your saved items
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate("/wishlist")}
                  sx={{ mt: 2 }}
                >
                  Go to Wishlist
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Saved Addresses Section */}
        <Grid item xs={12}>
          <Card sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            width: '100%'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              width: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocalShippingIcon color="primary" fontSize="large" />
                <Typography variant="h6" fontWeight="bold">
                  Saved Addresses
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddressDialog(true)}
              >
                Add New Address
              </Button>
            </Box>
            <Grid container spacing={2}>
              {savedAddresses.map((address) => (
                <Grid item xs={12} sm={6} md={4} key={address.id}>
                  <Card sx={{ 
                    p: 2, 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: 'background.default',
                    boxShadow: 0,
                    border: '1px solid',
                    borderColor: 'divider',
                    width: '100%',
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}>
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      {address.address}
                    </Typography>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteAddress(address.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Add Address Dialog */}
      <Dialog 
        open={openAddressDialog} 
        onClose={() => setOpenAddressDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LocalShippingIcon color="primary" />
          Add New Address
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            variant="outlined"
            size="small"
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 2, 
          pt: 1, 
          bgcolor: 'background.paper', 
          borderTop: '1px solid', 
          borderColor: 'divider',
          gap: 1,
        }}>
          <Button 
            onClick={() => setOpenAddressDialog(false)} 
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddAddress} 
            variant="contained"
            disabled={!newAddress.trim()}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
