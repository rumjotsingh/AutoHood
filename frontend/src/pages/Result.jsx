import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Fade,
  Chip,
  Container,
  Paper,
  Breadcrumbs,
  Stack,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  Speed, 
  ColorLens, 
  LocalGasStation, 
  Home, 
  NavigateNext,
  Search as SearchIcon,
  SentimentDissatisfied,
  DirectionsCar,
} from '@mui/icons-material';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CarGridSkeleton } from "../components/Skeleton";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { searchCars, clearSearchResults } from '../redux/slices/carsSlice';

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
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />

      {/* Breadcrumb */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', py: 2 }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<NavigateNext sx={{ fontSize: 18, color: '#94A3B8' }} />}
          >
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Home sx={{ fontSize: 18, color: '#64748B' }} />
              <Typography variant="body2" color="#64748B">Home</Typography>
            </Link>
            <Typography variant="body2" color="#0F172A" fontWeight={600}>
              Search Results
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          py: { xs: 5, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
          </Box>
          
          <Typography 
            variant="h3" 
            textAlign="center" 
            fontWeight={800}
            color="white"
            sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Search Results
          </Typography>
          <Typography 
            variant="body1" 
            textAlign="center" 
            sx={{ 
              color: '#94A3B8',
              mt: 2,
              fontSize: { xs: '1rem', md: '1.125rem' },
            }}
          >
            {searchTerm ? (
              <>
                Showing results for{' '}
                <Box component="span" sx={{ color: '#F97316', fontWeight: 600 }}>
                  &quot;{searchTerm}&quot;
                </Box>
              </>
            ) : (
              "All available cars"
            )}
          </Typography>
          
          {!loading && results.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Chip 
                label={`${results.length} car${results.length > 1 ? 's' : ''} found`}
                sx={{ 
                  bgcolor: 'rgba(249, 115, 22, 0.15)', 
                  color: '#F97316',
                  fontWeight: 600,
                  px: 1,
                }}
              />
            </Box>
          )}
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Fade in={mounted} timeout={600}>
          <Box>
            {loading ? (
              <CarGridSkeleton count={6} />
            ) : results.length > 0 ? (
              <Grid container spacing={4}>
                {results.map((car, index) => (
                  <Grid item xs={12} sm={6} md={4} key={car._id || index}>
                    <Fade in={mounted} timeout={500 + index * 100}>
                      <Card
                        sx={{
                          borderRadius: '20px',
                          overflow: "hidden",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                          bgcolor: 'white',
                          border: '1px solid #E2E8F0',
                          boxShadow: 'none',
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                            borderColor: '#F97316',
                            "& .car-image": {
                              transform: "scale(1.08)",
                            },
                          },
                        }}
                        onClick={() => handleCarClick(car._id)}
                      >
                        <Box sx={{ position: "relative", overflow: "hidden", height: 200, flexShrink: 0 }}>
                          <CardMedia
                            component="img"
                            image={car.image?.url}
                            alt={`${car.company} car`}
                            className="car-image"
                            sx={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                              transition: "transform 0.6s ease",
                            }}
                          />
                          <Chip
                            label={`₹${car.price?.toLocaleString('en-IN') || 'N/A'}`}
                            sx={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                              color: "white",
                              fontWeight: 700,
                              fontSize: '0.875rem',
                            }}
                          />
                        </Box>
                        <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                          <Typography 
                            variant="h6" 
                            fontWeight={700} 
                            color="#0F172A" 
                            gutterBottom
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {car.company}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="#64748B" 
                            mb={2}
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.6,
                              height: '44px',
                              flexShrink: 0,
                            }}
                          >
                            {car.description}
                          </Typography>
                          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: "auto" }}>
                            <Chip
                              icon={<Speed sx={{ fontSize: 16 }} />}
                              label={car.engine || "N/A"}
                              size="small"
                              sx={{
                                bgcolor: '#F1F5F9',
                                color: '#475569',
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: '#64748B' },
                              }}
                            />
                            <Chip
                              icon={<ColorLens sx={{ fontSize: 16 }} />}
                              label={car.color || "N/A"}
                              size="small"
                              sx={{
                                bgcolor: '#F1F5F9',
                                color: '#475569',
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: '#64748B' },
                              }}
                            />
                            <Chip
                              icon={<LocalGasStation sx={{ fontSize: 16 }} />}
                              label={`${car.mileage || "N/A"} kmpl`}
                              size="small"
                              sx={{
                                bgcolor: '#F1F5F9',
                                color: '#475569',
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: '#64748B' },
                              }}
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  py: 10,
                  px: 4,
                  borderRadius: '24px',
                  bgcolor: 'white',
                  border: '1px solid #E2E8F0',
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    bgcolor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <SentimentDissatisfied sx={{ fontSize: 40, color: '#94A3B8' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} color="#0F172A" gutterBottom>
                  No results found
                </Typography>
                <Typography variant="body1" color="#64748B" mb={4}>
                  We couldn&#39;t find any cars matching your search. Try a different term.
                </Typography>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Chip
                    icon={<DirectionsCar />}
                    label="Browse All Cars"
                    clickable
                    sx={{
                      px: 2,
                      py: 2.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                      },
                    }}
                  />
                </Link>
              </Paper>
            )}
          </Box>
        </Fade>
      </Container>

      <Footer />
    </Box>
  );
};

export default Results;
