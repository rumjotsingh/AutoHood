import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  CardMedia,
  Typography,
  Modal,
  Button,
  Grid,
  Container,
  Divider,
  Rating,
  Fade,
  Chip,
  Paper,
  Avatar,
  IconButton,
  Breadcrumbs,
} from "@mui/material";
import {
  Edit as EditIcon,
  ShoppingCart as ShoppingCartCheckoutIcon,
  Delete as DeleteIcon,
  Calculate as CalculateIcon,
  AccountBalance as AttachMoneyIcon,
  Speed,
  ColorLens,
  LocalGasStation,
  Person,
  Email,
  Close,
  
  Verified,
  Share,
  NavigateNext,
  Home,
  DirectionsCar,
  Star,
} from '@mui/icons-material';
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CarDetailSkeleton } from "../components/Skeleton";
import { toast } from "react-toastify";
import ReviewsForm from "./Review";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCarDetails, deleteCar, clearCurrentCar } from '../redux/slices/carsSlice';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import FavoriteButton from "../components/FavoriteButton";
import InquiryModal from "../components/InquiryModal";
import { Message } from "@mui/icons-material";


function CarsDetailed() {
  const { id } = useParams();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [inquiryModal, setInquiryModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const { currentCar: details } = useAppSelector((state) => state.cars);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCarDetails(id));
    return () => {
      dispatch(clearCurrentCar());
    };
  }, [id, dispatch, refreshTrigger]);

  const handleDeleteCar = async () => {
    const result = await dispatch(deleteCar({ id, token }));
    
    if (result.type === 'cars/delete/fulfilled') {
      toast.success("Car listing deleted successfully!");
      setTimeout(() => navigate("/"), 2000);
    } else {
      toast.error(result.payload?.message || "Failed to delete car listing");
    }
    setDeleteModal(false);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      if (!token) return toast.error("You must be logged in to delete a review.");
      const res = await fetch(API_ENDPOINTS.REVIEWS.DELETE(reviewId), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carId: id }),
      });

      if (res.status === 200) {
        toast.success("Review deleted successfully!");
        setRefreshTrigger(!refreshTrigger);
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to delete the review.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("An error occurred while deleting the review.");
    }
  };

  const handleCarEdit = () => navigate(`/edit/${id}`);
  
  const handleBuy = async() => {
    try {
      const res = await axios.post(
        API_ENDPOINTS.PAYMENT.CREATE,
        { id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      toast.error('Payment session failed. Please try again.');
    }
  }
  
  const handleCarLoan = () => navigate(`/car-loan/${id}`, { state: { carPrice: details.price } });

  if (!details) {
    return (
      <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <CarDetailSkeleton />
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Breadcrumb */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', py: 2 }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<NavigateNext sx={{ fontSize: 18, color: '#94A3B8' }} />}
            sx={{ 
              '& .MuiBreadcrumbs-li': {
                display: 'flex',
                alignItems: 'center',
              }
            }}
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
            <Typography variant="body2" color="#64748B">Cars</Typography>
            <Typography variant="body2" color="#0F172A" fontWeight={600}>
              {details.company}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          {/* Left Column - Image & Gallery */}
          <Grid item xs={12} md={7}>
            <Fade in={mounted} timeout={600}>
              <Box>
                {/* Main Image */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: { xs: 280, sm: 380, md: 450 },
                      objectFit: 'cover',
                    }}
                    image={details.image?.url}
                    alt={`${details.company} car`}
                  />
                  
                  {/* Action Buttons on Image */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <FavoriteButton carId={id} size="medium" showTooltip={true} />
                    <IconButton
                      sx={{
                        bgcolor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: 'white' },
                      }}
                    >
                      <Share sx={{ color: '#64748B' }} />
                    </IconButton>
                  </Box>

                  {/* Verified Badge */}
                  <Chip
                    icon={<Verified sx={{ fontSize: 16 }} />}
                    label="Verified Listing"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      bgcolor: '#10B981',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                </Paper>

                {/* Specifications Cards */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        textAlign: 'center',
                        bgcolor: 'white',
                        border: '1px solid #E2E8F0',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#F97316',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 20px rgba(249, 115, 22, 0.15)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: '#FFF7ED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1.5,
                        }}
                      >
                        <Speed sx={{ color: '#F97316', fontSize: 26 }} />
                      </Box>
                      <Typography variant="caption" color="#64748B" display="block">
                        Engine
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                        {details.engine}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        textAlign: 'center',
                        bgcolor: 'white',
                        border: '1px solid #E2E8F0',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#F97316',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 20px rgba(249, 115, 22, 0.15)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: '#FFF7ED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1.5,
                        }}
                      >
                        <LocalGasStation sx={{ color: '#F97316', fontSize: 26 }} />
                      </Box>
                      <Typography variant="caption" color="#64748B" display="block">
                        Mileage
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                        {details.engine === "Electric"
                          ? `${details.mileage} km/ch`
                          : `${details.mileage} kmpl`}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        textAlign: 'center',
                        bgcolor: 'white',
                        border: '1px solid #E2E8F0',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#F97316',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 20px rgba(249, 115, 22, 0.15)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: '#FFF7ED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1.5,
                        }}
                      >
                        <ColorLens sx={{ color: '#F97316', fontSize: 26 }} />
                      </Box>
                      <Typography variant="caption" color="#64748B" display="block">
                        Color
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                        {details.color}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Description */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mt: 3,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                    Description
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="#64748B"
                    sx={{ lineHeight: 1.8 }}
                  >
                    {details.description}
                  </Typography>
                </Paper>

                {/* Owner Info */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mt: 3,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                    Seller Information
                  </Typography>
                  {details.owner ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: '#0F172A',
                          fontWeight: 700,
                          fontSize: '1.25rem',
                        }}
                      >
                        {details.owner?.name?.charAt(0).toUpperCase() || 'S'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} color="#0F172A">
                          {details.owner?.name || 'Seller'}
                        </Typography>
                        {details.owner?.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Email sx={{ fontSize: 16, color: '#64748B' }} />
                            <Typography variant="body2" color="#64748B">
                              {details.owner.email}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: '#E2E8F0',
                          color: '#64748B',
                          fontWeight: 700,
                          fontSize: '1.25rem',
                        }}
                      >
                        <Person sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} color="#0F172A">
                          AutoHood Seller
                        </Typography>
                        <Typography variant="body2" color="#64748B">
                          Verified seller on our platform
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Fade>
          </Grid>

          {/* Right Column - Details & Actions */}
          <Grid item xs={12} md={5}>
            <Fade in={mounted} timeout={800}>
              <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
                {/* Price Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color="#0F172A">
                        {details.company}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Chip 
                          icon={<DirectionsCar sx={{ fontSize: 16 }} />}
                          label={details.engine}
                          size="small"
                          sx={{ 
                            bgcolor: '#F1F5F9', 
                            color: '#475569',
                            fontWeight: 500,
                          }}
                        />
                      </Stack>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                      mb: 3,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Price
                    </Typography>
                    <Typography variant="h3" fontWeight={800} color="white">
                      ₹{new Intl.NumberFormat("en-IN").format(details.price)}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  {token ? (
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<ShoppingCartCheckoutIcon />}
                        onClick={handleBuy}
                        sx={{
                          py: 1.75,
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                          fontWeight: 600,
                          fontSize: '1rem',
                          textTransform: 'none',
                          boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
                          },
                        }}
                      >
                        Buy Now
                      </Button>

                      {/* Contact Seller Button */}
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<Message />}
                        onClick={() => setInquiryModal(true)}
                        sx={{
                          py: 1.75,
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                          fontWeight: 600,
                          fontSize: '1rem',
                          textTransform: 'none',
                          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(16, 185, 129, 0.5)',
                          },
                        }}
                      >
                        Contact Seller
                      </Button>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<AttachMoneyIcon />}
                            onClick={handleCarLoan}
                            sx={{
                              py: 1.5,
                              borderRadius: '12px',
                              borderColor: '#E2E8F0',
                              borderWidth: 2,
                              color: '#0F172A',
                              fontWeight: 600,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#F97316',
                                borderWidth: 2,
                                bgcolor: '#FFF7ED',
                              },
                            }}
                          >
                            Car Loan
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<CalculateIcon />}
                            onClick={() => setOpenModal(true)}
                            sx={{
                              py: 1.5,
                              borderRadius: '12px',
                              borderColor: '#E2E8F0',
                              borderWidth: 2,
                              color: '#0F172A',
                              fontWeight: 600,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#F97316',
                                borderWidth: 2,
                                bgcolor: '#FFF7ED',
                              },
                            }}
                          >
                            On-Road
                          </Button>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 1 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<EditIcon />}
                            onClick={handleCarEdit}
                            sx={{
                              py: 1.5,
                              borderRadius: '12px',
                              borderColor: '#3B82F6',
                              color: '#3B82F6',
                              fontWeight: 600,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#3B82F6',
                                bgcolor: '#EFF6FF',
                              },
                            }}
                          >
                            Edit
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteModal(true)}
                            sx={{
                              py: 1.5,
                              borderRadius: '12px',
                              borderColor: '#EF4444',
                              color: '#EF4444',
                              fontWeight: 600,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#EF4444',
                                bgcolor: '#FEF2F2',
                              },
                            }}
                          >
                            Delete
                          </Button>
                        </Grid>
                      </Grid>
                    </Stack>
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: '#FFF7ED',
                        borderRadius: '16px',
                        border: '2px dashed #F97316',
                      }}
                    >
                      <Typography variant="body1" color="#F97316" fontWeight={600}>
                        Please log in to purchase or make changes
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/login')}
                        sx={{
                          mt: 2,
                          background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Login Now
                      </Button>
                    </Paper>
                  )}
                </Paper>

                {/* Trust Badges */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mt: 3,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Stack spacing={2}>
                    {[
                      { icon: <Verified />, text: 'Verified Listing' },
                      { icon: <Star />, text: 'Quality Assured' },
                      { icon: <Person />, text: 'Trusted Seller' },
                    ].map((item, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          color: '#10B981',
                        }}
                      >
                        {item.icon}
                        <Typography variant="body2" fontWeight={500}>
                          {item.text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* On-Road Price Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Fade in={openModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 450 },
                maxWidth: 500,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: 'white',
                  border: '1px solid #E2E8F0',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight={700} color="#0F172A">
                    On-Road Price
                  </Typography>
                  <IconButton onClick={() => setOpenModal(false)}>
                    <Close />
                  </IconButton>
                </Box>

                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#F8FAFC',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography color="#64748B">Ex-Showroom Price</Typography>
                    <Typography fontWeight={600} color="#0F172A">
                      ₹{details.price.toLocaleString("en-IN")}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#F8FAFC',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography color="#64748B">RTO & Registration (10%)</Typography>
                    <Typography fontWeight={600} color="#0F172A">
                      ₹{(details.price * 0.1).toLocaleString("en-IN")}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#F8FAFC',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography color="#64748B">Insurance (1%)</Typography>
                    <Typography fontWeight={600} color="#0F172A">
                      ₹{(details.price * 0.01).toLocaleString("en-IN")}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 3,
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                      borderRadius: '16px',
                      color: 'white',
                    }}
                  >
                    <Typography sx={{
                      color: 'white',
                  }}  variant="h6" fontWeight={600}>
                      Total On-Road Price
                    </Typography>
                    <Typography sx={{
                      color: 'white',
                  }}  variant="h6" fontWeight={700}>
                      ₹{(details.price * 1.11).toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setOpenModal(false)}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Got It
                </Button>
              </Paper>
            </Box>
          </Fade>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
          <Fade in={deleteModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 400 },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: 'white',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: '#FEF2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 32, color: '#EF4444' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} color="#0F172A" gutterBottom>
                  Delete Listing?
                </Typography>
                <Typography variant="body1" color="#64748B" mb={3}>
                  This action cannot be undone. Are you sure you want to delete this car listing?
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setDeleteModal(false)}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      borderColor: '#E2E8F0',
                      color: '#64748B',
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleDeleteCar}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      bgcolor: '#EF4444',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#DC2626',
                      },
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Fade>
        </Modal>

        {/* Reviews Section */}
        <Box sx={{ mt: 6 }}>
          <ReviewsForm refresh={() => setRefreshTrigger(!refreshTrigger)} />

          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              color="#0F172A"
              gutterBottom
              sx={{ mb: 4 }}
            >
              Customer Reviews
              {details.reviews?.length > 0 && (
                <Chip 
                  label={details.reviews.length} 
                  size="small" 
                  sx={{ 
                    ml: 2, 
                    bgcolor: '#FFF7ED', 
                    color: '#F97316',
                    fontWeight: 600,
                  }} 
                />
              )}
            </Typography>

            {details.reviews?.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  textAlign: 'center',
                  borderRadius: '20px',
                  bgcolor: 'white',
                  border: '1px solid #E2E8F0',
                }}
              >
                <Star sx={{ fontSize: 48, color: '#E2E8F0', mb: 2 }} />
                <Typography variant="h6" color="#64748B">
                  No reviews yet. Be the first to share your experience!
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {details.reviews.map((review,) => (
                  <Grid item xs={12} key={review._id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '20px',
                        bgcolor: 'white',
                        border: '1px solid #E2E8F0',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#F97316',
                          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.1)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: '#0F172A',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                          }}
                        >
                          {review.author?.name?.charAt(0).toUpperCase() || "A"}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600} color="#0F172A">
                                {review.author?.name || "Anonymous"}
                              </Typography>
                              <Typography variant="caption" color="#64748B">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </Typography>
                            </Box>
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#F97316',
                                },
                              }}
                            />
                          </Box>
                          <Typography 
                            variant="body1" 
                            color="#475569"
                            sx={{ lineHeight: 1.8, my: 2 }}
                          >
                            {review.comment}
                          </Typography>
                          {token && (
                            <Button
                              size="small"
                              startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                              onClick={() => handleDeleteReview(review._id)}
                              sx={{
                                color: '#EF4444',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                  bgcolor: '#FEF2F2',
                                },
                              }}
                            >
                              Delete Review
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Container>

      {/* Inquiry Modal */}
      <InquiryModal
        open={inquiryModal}
        onClose={() => setInquiryModal(false)}
        car={details}
      />
      
      <Footer />
    </Box>
  );
}

export default CarsDetailed;
