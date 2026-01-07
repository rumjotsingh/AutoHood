import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Fade,
  Zoom,
  Chip,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { searchCars, clearSearchResults } from '../redux/slices/carsSlice';
import { BASE_URL } from '../config/api';
import { Speed, ColorLens, LocalGasStation } from '@mui/icons-material';

const Results = () => {
  const location = useLocation();
  const searchTerm = location.state?.searchTerm || ""; 
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const { searchResults: results, loading } = useAppSelector((state) => state.cars);

  useEffect(() => {
    setMounted(true);
    if (searchTerm) {
      dispatch(searchCars(searchTerm));
    }
    return () => {
      dispatch(clearSearchResults());
    };
  }, [searchTerm, dispatch]);

  const handleCarClick = (id) => {
    navigate(`/cars/${id}`);
  };

  return (
    <>
      <Navbar />

      <Fade in={mounted} timeout={800}>
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            minHeight: "100vh",
            bgcolor: "#f5f7fa",
          }}
        >
          {/* Hero Section */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              py: { xs: 4, md: 6 },
              mt: 2,
            }}
          >
            <Typography 
              variant="h3" 
              textAlign="center" 
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.75rem', md: '3rem' } }}
            >
              Search Results
            </Typography>
            <Typography 
              variant="h6" 
              textAlign="center" 
              mt={2} 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '1rem', md: '1.25rem' },
                px: { xs: 2, md: 0 }
              }}
            >
              {searchTerm ? `Showing results for "${searchTerm}"` : "All Cars"}
            </Typography>
          </Box>

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : results.length > 0 ? (
              <Grid container spacing={4}>
                {results.map((car, index) => (
                  <Grid item xs={12} sm={6} md={4} key={car._id || index}>
                    <Zoom in={mounted} timeout={500 + index * 100}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          height: "100%",
                          cursor: "pointer",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-12px)",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                            "& .car-image": {
                              transform: "scale(1.1)",
                            },
                          },
                        }}
                        onClick={() => handleCarClick(car._id)}
                      >
                        <Box sx={{ position: "relative", overflow: "hidden" }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={`${BASE_URL.replace('/api', '')}/${car.image?.url?.replace(/\\/g, "/") || ''}`}
                            alt={`${car.company} car`}
                            className="car-image"
                            sx={{
                              objectFit: "cover",
                              transition: "transform 0.6s ease",
                            }}
                          />
                          <Chip
                            label={`$${car.price?.toLocaleString() || 'N/A'}`}
                            sx={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              bgcolor: "rgba(102, 126, 234, 0.95)",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </Box>
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {car.company}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            {car.description}
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            <Chip
                              icon={<Speed fontSize="small" />}
                              label={car.engine || "N/A"}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<ColorLens fontSize="small" />}
                              label={car.color || "N/A"}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<LocalGasStation fontSize="small" />}
                              label={`${car.mileage || "N/A"} MPG`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={8}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No results found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try a different search term
                </Typography>
              </Box>
            )}
          </Box>

          <Footer />
        </Box>
      </Fade>
    </>
  );
};

export default Results;
