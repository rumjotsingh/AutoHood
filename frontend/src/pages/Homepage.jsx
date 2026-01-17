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
  Box, 
  Pagination,
  Chip,
  Button,
  Stack,
  Paper,
  Rating,
  Avatar,
} from "@mui/material";
import { 
  Speed, 
  ColorLens, 
  LocalGasStation,
  DirectionsCar,
  VerifiedUser,
  SupportAgent,
  LocalShipping,
  ArrowForward,
  Star,
  CheckCircle,
  TrendingUp,
  Security,
  Visibility,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CarGridSkeleton } from "../components/Skeleton";
import LazyLoad from 'react-lazyload';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAllCars, setCurrentPage } from '../redux/slices/carsSlice';
import { fetchFavorites } from '../redux/slices/favoritesSlice';
import FavoriteButton from "../components/FavoriteButton";

function Homepage() {
  const [mounted, setMounted] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cars, loading, pagination } = useAppSelector((state) => state.cars);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchAllCars({ 
      page: pagination.currentPage, 
      limit: 6 
    }));
    
    // Fetch user's favorites if logged in
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [pagination.currentPage, dispatch, isAuthenticated]);

  const handleCarClick = (id) => {
    navigate(`/cars/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(setCurrentPage(value));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trust Stats
  const stats = [
    { value: "10,000+", label: "Cars Listed", icon: <DirectionsCar /> },
    { value: "5,000+", label: "Happy Customers", icon: <Star /> },
    { value: "99%", label: "Satisfaction Rate", icon: <VerifiedUser /> },
    { value: "24/7", label: "Support Available", icon: <SupportAgent /> },
  ];

  // How it Works Steps
  const steps = [
    { 
      step: "01", 
      title: "Search & Browse", 
      description: "Explore our vast collection of verified vehicles",
      icon: <Visibility sx={{ fontSize: 32 }} />,
    },
    { 
      step: "02", 
      title: "Compare & Choose", 
      description: "Compare features, prices, and reviews side by side",
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
    },
    { 
      step: "03", 
      title: "Secure Purchase", 
      description: "Complete your purchase with our secure payment system",
      icon: <Security sx={{ fontSize: 32 }} />,
    },
    { 
      step: "04", 
      title: "Doorstep Delivery", 
      description: "Get your dream car delivered right to your doorstep",
      icon: <LocalShipping sx={{ fontSize: 32 }} />,
    },
  ];

  // Why Choose Us
  const features = [
    { 
      title: "Verified Listings", 
      description: "Every vehicle is thoroughly inspected and verified for quality",
      icon: <CheckCircle />,
    },
    { 
      title: "Best Prices", 
      description: "Competitive pricing with no hidden fees or charges",
      icon: <TrendingUp />,
    },
    { 
      title: "Secure Transactions", 
      description: "End-to-end encrypted payments for your peace of mind",
      icon: <Security />,
    },
    { 
      title: "Expert Support", 
      description: "24/7 customer support from automotive experts",
      icon: <SupportAgent />,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Business Owner",
      content: "AutoHood made buying my dream car incredibly easy. The process was smooth and the team was very helpful!",
      rating: 5,
      avatar: "R",
    },
    {
      name: "Priya Patel",
      role: "Software Engineer",
      content: "Sold my car within a week! Great platform with genuine buyers. Highly recommend for anyone looking to sell.",
      rating: 5,
      avatar: "P",
    },
    {
      name: "Amit Kumar",
      role: "Doctor",
      content: "The verification process gave me confidence. Found exactly what I was looking for at a great price.",
      rating: 5,
      avatar: "A",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
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
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient Orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  animation: mounted ? 'fadeInUp 0.8s ease-out' : 'none',
                }}
              >
                
                <Typography
                  variant="h1"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    lineHeight: 1.1,
                    mb: 3,
                    letterSpacing: '-0.02em',
                    color: 'white', 
                  }}
                >
                  Find Your Perfect
                  <Box 
                    component="span" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'block',
                    }}
                  >
                    Dream Car Today
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    mb: 4,
                    color: '#94A3B8',
                    maxWidth: 500,
                    lineHeight: 1.7,
                  }}
                >
                  Discover thousands of verified vehicles from trusted sellers. 
                  Buy, sell, or explore with confidence on India&#39;s most trusted automotive platform.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                      background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 4,
                      py: 1.75,
                      borderRadius: '14px',
                      boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
                      },
                    }}
                  >
                    Browse Cars
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/add-car')}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      borderWidth: 2,
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 4,
                      py: 1.75,
                      borderRadius: '14px',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        borderWidth: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Sell Your Car
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  animation: mounted ? 'fadeInRight 0.8s ease-out' : 'none',
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop"
                  alt="Luxury Car"
                  sx={{
                    width: '100%',
                    borderRadius: '24px',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust Stats Section */}
      <Box sx={{ py: 4, bgcolor: 'white', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    py: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      bgcolor: '#FFF7ED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F97316',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#0F172A">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="#64748B">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Cars Section */}
      <Box component="main" sx={{ py: { xs: 6, md: 8 } }} id="featured">
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box mb={5} textAlign="center">
            {/* <Chip 
              label="Featured Collection" 
              sx={{ 
                bgcolor: '#FFF7ED', 
                color: '#F97316',
                fontWeight: 600,
                mb: 2,
              }} 
            /> */}
            <Typography 
              variant="h3" 
              fontWeight={800} 
              color="#0F172A" 
              gutterBottom
              sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
            >
              Explore Our Premium Vehicles
            </Typography>
            <Typography variant="body1" color="#64748B" maxWidth={600} mx="auto">
              Hand-picked selection of verified cars from trusted sellers. 
              Every vehicle comes with complete documentation and inspection reports.
            </Typography>
          </Box>

          {loading ? (
            <CarGridSkeleton count={6} />
          ) : (
            <>
              <Grid container spacing={3}>
                {cars.map((car) => (
                  <Grid item xs={12} sm={6} md={4} key={car._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: '16px',
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: "1px solid #E2E8F0",
                        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15)",
                          "& .car-image": {
                            transform: "scale(1.05)",
                          },
                        },
                      }}
                    >
                      {/* Favorite Button - Outside CardActionArea to prevent button nesting */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 10,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FavoriteButton carId={car._id} size="small" showTooltip={true} />
                      </Box>

                      <CardActionArea 
                        onClick={() => handleCarClick(car._id)}
                        sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
                      >
                        <Box sx={{ position: "relative", overflow: "hidden", height: 200, flexShrink: 0 }}>
                          <LazyLoad height={200} offset={100} once>
                            <CardMedia
                              component="img"
                              image={car?.image?.url || car?.image || '/placeholder-car.png'}
                              alt={`${car.company || car.carName || 'Car'}`}
                              className="car-image"
                              sx={{
                                width: "100%",
                                height: 200,
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                              }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                              }}
                            />
                          </LazyLoad>

                          {/* Price Badge */}
                          <Chip
                            label={`₹${car.price?.toLocaleString('en-IN') || 'N/A'}`}
                            sx={{
                              position: "absolute",
                              bottom: 12,
                              left: 12,
                              bgcolor: "#0F172A",
                              color: "white",
                              fontWeight: 700,
                              fontSize: "0.95rem",
                              py: 2,
                            }}
                          />
                        </Box>

                        <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                            sx={{
                              color: '#0F172A',
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {car.company}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: '#64748B',
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              height: "44px",
                              lineHeight: 1.6,
                              flexShrink: 0,
                            }}
                          >
                            {car.description}
                          </Typography>

                          {/* Car Details */}
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: "auto" }}>
                            <Chip
                              icon={<Speed sx={{ fontSize: 16 }} />}
                              label={car.engine || "N/A"}
                              size="small"
                              sx={{ 
                                bgcolor: '#F1F5F9',
                                color: '#475569',
                                fontWeight: 500,
                                fontSize: '0.75rem',
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
                                fontSize: '0.75rem',
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
                                fontSize: '0.75rem',
                              }}
                            />
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <Box display="flex" justifyContent="center" sx={{ mt: 6 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: 600,
                      borderRadius: '10px',
                      mx: 0.5,
                      "&:hover": {
                        bgcolor: '#FFF7ED',
                      },
                    },
                    "& .Mui-selected": {
                      background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%) !important',
                      color: 'white !important',
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            {/* <Chip 
              label="Simple Process" 
              sx={{ 
                bgcolor: '#FFF7ED', 
                color: '#F97316',
                fontWeight: 600,
                mb: 2,
              }} 
            /> */}
            <Typography 
              variant="h3" 
              fontWeight={800} 
              color="#0F172A"
              sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
            >
              How AutoHood Works
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: '#F97316',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 30px rgba(249, 115, 22, 0.15)',
                      '& .step-icon': {
                        background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                        color: 'white',
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 20,
                      fontSize: '4rem',
                      fontWeight: 800,
                      color: '#F1F5F9',
                      lineHeight: 1,
                    }}
                  >
                    {step.step}
                  </Typography>
                  <Box
                    className="step-icon"
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '18px',
                      bgcolor: '#FFF7ED',
                      color: '#F97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      transition: 'all 0.3s',
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="#64748B" lineHeight={1.7}>
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#0F172A', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Chip 
                label="Why AutoHood" 
                sx={{ 
                  bgcolor: 'rgba(249, 115, 22, 0.2)', 
                  color: '#FB923C',
                  fontWeight: 600,
                  mb: 2,
                }} 
              />
              <Typography 
                variant="h3" 
                fontWeight={800}
                sx={{ 
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  mb: 3,
                }}
              >
                The Trusted Choice for{' '}
                <Box component="span" sx={{ color: '#F97316' }}>
                  Smart Buyers
                </Box>
              </Typography>
              <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4, lineHeight: 1.8 }}>
                We&#39;ve helped thousands of customers find their perfect vehicle. 
                Our commitment to transparency, quality, and customer satisfaction 
                sets us apart from the competition.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/about')}
                sx={{
                  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                  },
                }}
              >
                Learn More About Us
              </Button>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-3px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: 'rgba(249, 115, 22, 0.2)',
                          color: '#FB923C',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600} color="white" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip 
              label="Customer Reviews" 
              sx={{ 
                bgcolor: '#FFF7ED', 
                color: '#F97316',
                fontWeight: 600,
                mb: 2,
              }} 
            />
            <Typography 
              variant="h3" 
              fontWeight={800} 
              color="#0F172A"
              sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
            >
              What Our Customers Say
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    bgcolor: 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 30px rgba(15, 23, 42, 0.1)',
                    },
                  }}
                >
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2, color: '#F97316' }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#475569', 
                      mb: 3, 
                      lineHeight: 1.8,
                      fontStyle: 'italic',
                    }}
                  >
                    &quot;{testimonial.content}&quot;
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: '#0F172A',
                        fontWeight: 700,
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} color="#0F172A">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="#64748B">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            fontWeight={800} 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Ready to Find Your Dream Car?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9, 
              mb: 4, 
              maxWidth: 500, 
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Join thousands of satisfied customers who found their perfect vehicle with AutoHood.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              sx={{
                bgcolor: 'white',
                color: '#F97316',
                fontWeight: 700,
                fontSize: '1rem',
                px: 4,
                py: 1.75,
                borderRadius: '14px',
                textTransform: 'none',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              Start Browsing
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 2,
                fontWeight: 600,
                fontSize: '1rem',
                px: 4,
                py: 1.75,
                borderRadius: '14px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  borderWidth: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Homepage;
