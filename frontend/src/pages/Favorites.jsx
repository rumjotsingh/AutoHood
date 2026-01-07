import { useEffect } from "react";
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
  Skeleton,
  Paper,
} from "@mui/material";
import {
  Favorite,
  Delete,
  Visibility,
  Speed,
  LocalGasStation,
  ArrowBack,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFavorites, removeFromFavorites } from "../redux/slices/favoritesSlice";
import CompareButton from "../components/CompareButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { favorites, loading } = useSelector((state) => state.favorites);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (carId) => {
    dispatch(removeFromFavorites(carId));
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Favorite sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Sign in to view your favorites
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Save cars you love and access them anytime.
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Favorite sx={{ fontSize: 32, color: "#EF4444" }} />
            <Box>
              <Typography variant="h4" fontWeight={700} color="#0F172A">
                My Favorites
              </Typography>
              <Typography color="text.secondary">
                {favorites.length} car{favorites.length !== 1 ? "s" : ""} saved
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Loading State */}
        {loading && (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <Favorite sx={{ fontSize: 80, color: "#E2E8F0", mb: 3 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              No favorites yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
              Start browsing and save cars you&apos;re interested in. They&apos;ll appear here for easy access.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/search")}
              sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
            >
              Browse Cars
            </Button>
          </Paper>
        )}

        {/* Favorites Grid */}
        {!loading && favorites.length > 0 && (
          <Grid container spacing={3}>
            {favorites.map((fav) => {
              const car = fav.car || fav;
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={fav._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={car.image?.url || car.image}
                        alt={car.carName}
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/cars/${car._id}`)}
                      />
                      {/* Action buttons overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <CompareButton carId={car._id} size="small" />
                        <IconButton
                          size="small"
                          onClick={() => handleRemove(car._id)}
                          sx={{
                            bgcolor: "background.paper",
                            color: "error.main",
                            boxShadow: 1,
                            "&:hover": { bgcolor: "error.main", color: "white" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
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
                        {car.carName}
                      </Typography>

                      <Typography
                        variant="h5"
                        color="#F97316"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                      >
                        ₹{car.price?.toLocaleString('en-IN')}
                      </Typography>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {car.mileage && (
                          <Chip
                            icon={<Speed sx={{ fontSize: 16 }} />}
                            label={`${car.mileage.toLocaleString()} mi`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {car.engine && (
                          <Chip
                            icon={<LocalGasStation sx={{ fontSize: 16 }} />}
                            label={car.engine}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/cars/${car._id}`)}
                        sx={{
                          bgcolor: "#0F172A",
                          "&:hover": { bgcolor: "#1E293B" },
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Favorites;
