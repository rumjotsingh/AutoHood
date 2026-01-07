import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  DirectionsCar,
  Edit,
  Delete,
  Visibility,
  Add,
  ArrowBack,
  Speed,
  LocalGasStation,
  MoreVert,
  TrendingUp,
  AttachMoney,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../config/axiosInstance";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyListings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, car: null });
  const [deleting, setDeleting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyListings();
    }
  }, [isAuthenticated]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/v1/cars/my-listings");
      setListings(response.data.cars || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError(err.response?.data?.message || "Failed to fetch your listings");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, car) => {
    setAnchorEl(event.currentTarget);
    setSelectedCar(car);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCar(null);
  };

  const handleEdit = (carId) => {
    handleMenuClose();
    navigate(`/edit/${carId}`);
  };

  const handleView = (carId) => {
    handleMenuClose();
    navigate(`/cars/${carId}`);
  };

  const handleDeleteClick = (car) => {
    handleMenuClose();
    setDeleteDialog({ open: true, car });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.car) return;

    try {
      setDeleting(true);
      await api.delete(`/v1/cars/${deleteDialog.car._id}`);
      toast.success("Car listing deleted successfully!");
      setListings(listings.filter((car) => car._id !== deleteDialog.car._id));
      setDeleteDialog({ open: false, car: null });
    } catch (err) {
      console.error("Failed to delete listing:", err);
      toast.error(err.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, car: null });
  };

  // Stats calculation
  const totalValue = listings.reduce((sum, car) => sum + (car.price || 0), 0);
  const activeListings = listings.length;

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <DirectionsCar sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Sign in to view your listings
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Manage your car listings and track their performance.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
            >
              Sign In
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Back
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <DirectionsCar sx={{ fontSize: 32, color: "#F97316" }} />
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#0F172A">
                    My Listings
                  </Typography>
                  <Typography color="text.secondary">
                    Manage your car listings
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/add-car")}
                sx={{
                  bgcolor: "#F97316",
                  "&:hover": { bgcolor: "#EA580C" },
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Add New Car
              </Button>
            </Box>
          </Box>

          {/* Stats Cards */}
          {!loading && listings.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                    color: "white",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "rgba(249, 115, 22, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <DirectionsCar sx={{ color: "#F97316" }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {activeListings}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Active Listings
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    color: "white",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AttachMoney sx={{ color: "white" }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        ₹{(totalValue / 100000).toFixed(1)}L
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Total Value
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                    color: "white",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TrendingUp sx={{ color: "white" }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        ₹{activeListings > 0 ? (totalValue / activeListings / 100000).toFixed(1) : 0}L
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Avg. Price
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Card sx={{ borderRadius: "16px" }}>
                    <Skeleton variant="rectangular" height={180} />
                    <CardContent>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {!loading && !error && listings.length === 0 && (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: "20px" }}>
              <DirectionsCar sx={{ fontSize: 80, color: "#E2E8F0", mb: 3 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                No listings yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
                You haven&apos;t listed any cars for sale yet. Start selling your car today!
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/add-car")}
                sx={{
                  bgcolor: "#F97316",
                  "&:hover": { bgcolor: "#EA580C" },
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                }}
              >
                List Your First Car
              </Button>
            </Paper>
          )}

          {/* Listings Grid */}
          {!loading && listings.length > 0 && (
            <Grid container spacing={3}>
              {listings.map((car) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={car._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={car.image?.url || car.image || "https://via.placeholder.com/400x200?text=No+Image"}
                        alt={car.company}
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/cars/${car._id}`)}
                      />
                      {/* Menu Button */}
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, car)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "white",
                          boxShadow: 1,
                          "&:hover": { bgcolor: "white" },
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                      {/* Price Badge */}
                      <Chip
                        label={`₹${car.price?.toLocaleString("en-IN")}`}
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          left: 12,
                          bgcolor: "#0F172A",
                          color: "white",
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                        noWrap
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/cars/${car._id}`)}
                      >
                        {car.company}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          height: "40px",
                        }}
                      >
                        {car.description}
                      </Typography>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {car.engine && (
                          <Chip
                            icon={<Speed sx={{ fontSize: 14 }} />}
                            label={car.engine}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                        {car.mileage && (
                          <Chip
                            icon={<LocalGasStation sx={{ fontSize: 14 }} />}
                            label={`${car.mileage} kmpl`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(car._id)}
                        sx={{
                          flex: 1,
                          borderColor: "#3B82F6",
                          color: "#3B82F6",
                          textTransform: "none",
                          "&:hover": { borderColor: "#3B82F6", bgcolor: "#EFF6FF" },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteClick(car)}
                        sx={{
                          flex: 1,
                          borderColor: "#EF4444",
                          color: "#EF4444",
                          textTransform: "none",
                          "&:hover": { borderColor: "#EF4444", bgcolor: "#FEF2F2" },
                        }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Context Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { borderRadius: "12px", minWidth: 150 },
            }}
          >
            <MenuItem onClick={() => handleView(selectedCar?._id)}>
              <Visibility sx={{ mr: 1, fontSize: 20 }} /> View
            </MenuItem>
            <MenuItem onClick={() => handleEdit(selectedCar?._id)}>
              <Edit sx={{ mr: 1, fontSize: 20 }} /> Edit
            </MenuItem>
            <MenuItem
              onClick={() => handleDeleteClick(selectedCar)}
              sx={{ color: "error.main" }}
            >
              <Delete sx={{ mr: 1, fontSize: 20 }} /> Delete
            </MenuItem>
          </Menu>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={handleDeleteCancel}
            PaperProps={{ sx: { borderRadius: "16px" } }}
          >
            <DialogTitle sx={{ fontWeight: 600 }}>Delete Listing?</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete &quot;{deleteDialog.car?.company}&quot;?
                This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleDeleteCancel} disabled={deleting}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default MyListings;
