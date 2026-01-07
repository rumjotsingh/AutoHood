import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActionArea, 
  CircularProgress, 
  Box, 
  Pagination,
  Fade,
  Zoom,
  Chip,
  IconButton,
} from "@mui/material";
import { 
  Speed, 
  ColorLens, 
  LocalGasStation,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LazyLoad from 'react-lazyload';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAllCars, setCurrentPage } from '../redux/slices/carsSlice';

function Homepage() {
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cars, loading, pagination } = useAppSelector((state) => state.cars);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchAllCars({ 
      page: pagination.currentPage, 
      limit: 6 
    }));
  }, [pagination.currentPage, dispatch]);

  const handleCarClick = (id) => {
    navigate(`/cars/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(setCurrentPage(value));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (e, carId) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      return newFavorites;
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 6, md: 8 },
          mt: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <Fade in={mounted} timeout={1000}>
            <Box textAlign="center">
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
                  mb: 2,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  animation: "fadeInDown 1s ease-in-out",
                }}
              >
                Find Your Dream Car
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  mb: 4,
                  opacity: 0.9,
                  animation: "fadeInUp 1s ease-in-out",
                }}
              >
                Discover the best deals on premium vehicles
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="lg">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <>
              <Box mb={4} textAlign="center">
                <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
                  Featured Collection
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Browse our curated selection of premium vehicles
                </Typography>
              </Box>

              <Grid container spacing={4}>
                {cars.map((car, index) => (
                  <Grid item xs={12} sm={6} md={4} key={car._id}>
                    <Zoom in={mounted} timeout={500 + index * 100}>
                      <Card
                        onClick={() => handleCarClick(car._id)}
                        sx={{
                          cursor: "pointer",
                          height: "100%",
                          borderRadius: 3,
                          overflow: "hidden",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          border: "1px solid rgba(102, 126, 234, 0.1)",
                          "&:hover": {
                            transform: "translateY(-12px)",
                            boxShadow: "0 20px 40px rgba(102, 126, 234, 0.25)",
                            border: "1px solid rgba(102, 126, 234, 0.3)",
                            "& .car-image": {
                              transform: "scale(1.08)",
                            },
                            "& .price-badge": {
                              transform: "scale(1.05)",
                              bgcolor: "#667eea",
                            },
                            "& .car-title": {
                              color: "#667eea",
                            },
                          },
                        }}
                      >
                        <CardActionArea sx={{ height: "100%" }}>
                          <Box sx={{ position: "relative", overflow: "hidden" }}>
                            <LazyLoad height={240} offset={100} once>
                              <CardMedia
                                component="img"
                                height="240"
                                image={`${car?.image ?.url}`}
                                alt={`${car.company} car`}
                                className="car-image"
                                sx={{
                                  objectFit: "cover",
                                  transition: "transform 0.6s ease",
                                }}
                              />
                            </LazyLoad>
                            
                            {/* Favorite Button */}
                            <IconButton
                              onClick={(e) => toggleFavorite(e, car._id)}
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                bgcolor: "rgba(255, 255, 255, 0.9)",
                                "&:hover": {
                                  bgcolor: "white",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.3s",
                              }}
                            >
                              {favorites.has(car._id) ? (
                                <Favorite sx={{ color: "#f5576c" }} />
                              ) : (
                                <FavoriteBorder />
                              )}
                            </IconButton>

                            {/* Price Badge */}
                            <Chip
                              label={`$${car.price?.toLocaleString() || 'N/A'}`}
                              className="price-badge"
                              sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                bgcolor: "rgba(102, 126, 234, 0.95)",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                backdropFilter: "blur(10px)",
                                transition: "all 0.3s ease",
                              }}
                            />
                          </Box>

                          <CardContent sx={{ p: 3 }}>
                            <Typography
                              variant="h5"
                              fontWeight="bold"
                              gutterBottom
                              className="car-title"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                transition: "color 0.3s ease",
                              }}
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
                                minHeight: "40px",
                              }}
                            >
                              {car.description}
                            </Typography>

                            {/* Car Details */}
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: 2,
                              }}
                            >
                              <Chip
                                icon={<Speed fontSize="small" />}
                                label={car.engine || "N/A"}
                                size="small"
                                sx={{ 
                                  fontSize: "0.75rem",
                                  bgcolor: "rgba(102, 126, 234, 0.1)",
                                  border: "1px solid rgba(102, 126, 234, 0.3)",
                                  color: "#667eea",
                                  fontWeight: 600,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    bgcolor: "#667eea",
                                    color: "white",
                                    transform: "scale(1.05)",
                                  },
                                }}
                              />
                              <Chip
                                icon={<ColorLens fontSize="small" />}
                                label={car.color || "N/A"}
                                size="small"
                                sx={{ 
                                  fontSize: "0.75rem",
                                  bgcolor: "rgba(245, 87, 108, 0.1)",
                                  border: "1px solid rgba(245, 87, 108, 0.3)",
                                  color: "#f5576c",
                                  fontWeight: 600,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    bgcolor: "#f5576c",
                                    color: "white",
                                    transform: "scale(1.05)",
                                  },
                                }}
                              />
                              <Chip
                                icon={<LocalGasStation fontSize="small" />}
                                label={`${car.mileage || "N/A"} MPG`}
                                size="small"
                                sx={{ 
                                  fontSize: "0.75rem",
                                  bgcolor: "rgba(17, 153, 142, 0.1)",
                                  border: "1px solid rgba(17, 153, 142, 0.3)",
                                  color: "#11998e",
                                  fontWeight: 600,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    bgcolor: "#11998e",
                                    color: "white",
                                    transform: "scale(1.05)",
                                  },
                                }}
                              />
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <Box display="flex" justifyContent="center" sx={{ mt: 6 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontSize: "1rem",
                      fontWeight: "bold",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    },
                    "& .Mui-selected": {
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Homepage;
