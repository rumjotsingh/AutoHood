import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Modal,
  Button,
  Grid,
  CircularProgress,
  Container,
  Divider,
  Rating,
  Fade,
  Zoom,
  Chip,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Speed, ColorLens, LocalGasStation, Person, Email, Close } from '@mui/icons-material';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import ReviewsForm from "./Review";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCarDetails, deleteCar, clearCurrentCar } from '../redux/slices/carsSlice';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';


function CarsDetailed() {
  const { id } = useParams();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const { currentCar: details } = useAppSelector((state) => state.cars);
  const { token } = useAppSelector((state) => state.auth);
  console.log("Car Details:", details);

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
    setOpenModal(false);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      if (!token) return toast.error("You must be logged in to delete a review.");
      const res = await fetch(API_ENDPOINTS.REVIEWS.DELETE.replace(':id', reviewId), {
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          py: { xs: 1, md: 1 },
        }}
      >
        <Container maxWidth="lg">
          <Fade in={mounted} timeout={800}>
            <Box>
              {/* Hero Card */}
              <Zoom in={mounted} timeout={600}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    mb: 4,
                  }}
                >
                  {/* Header Section */}
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      py: { xs: 2.5, md: 3 },
                      px: { xs: 2, md: 4 },
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        mb: 1,
                      }}
                    >
                      {details.company}
                    </Typography>
                    <Chip
                      label={`₹${new Intl.NumberFormat("en-IN").format(details.price)}`}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        py: { xs: 2, md: 2.5 },
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  </Box>

                  {/* Image Section */}
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      sx={{
                        height: { xs: 300, sm: 400, md: 500 },
                        width: "100%",
                        objectFit: "cover",
                      }}
                      image={details.image?.url}
                      alt={`${details.company} car`}
                    />
                  </Box>

                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    {/* Description */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, md: 3 },
                        mb: 3,
                        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                        borderRadius: 3,
                        border: "1px solid rgba(102, 126, 234, 0.1)",
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        gutterBottom 
                        color="#667eea"
                        sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                      >
                        Description
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.7 }}
                      >
                        {details.description}
                      </Typography>
                    </Paper>

                    {/* Specifications Grid */}
                    <Grid container spacing={{ xs: 2, md: 3 }} mb={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 2, md: 2.5 },
                            borderRadius: 3,
                            textAlign: "center",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            transition: "all 0.3s",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                            },
                          }}
                        >
                          <Speed sx={{ fontSize: { xs: 35, md: 40 }, mb: 1 }} />
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                            Engine
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            {details.engine}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 2, md: 2.5 },
                            borderRadius: 3,
                            textAlign: "center",
                            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            color: "white",
                            transition: "all 0.3s",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 8px 20px rgba(245, 87, 108, 0.3)",
                            },
                          }}
                        >
                          <LocalGasStation sx={{ fontSize: { xs: 35, md: 40 }, mb: 1 }} />
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                            Mileage
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            {details.engine === "Electric"
                              ? `${details.mileage} km/charge`
                              : `${details.mileage} kmpl`}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 2, md: 2.5 },
                            borderRadius: 3,
                            textAlign: "center",
                            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                            color: "white",
                            transition: "all 0.3s",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 8px 20px rgba(17, 153, 142, 0.3)",
                            },
                          }}
                        >
                          <ColorLens sx={{ fontSize: { xs: 35, md: 40 }, mb: 1 }} />
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                            Color
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            {details.color}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Owner Information */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        background: "rgba(102, 126, 234, 0.05)",
                        border: "1px solid rgba(102, 126, 234, 0.1)",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="#667eea">
                        Owner Details
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ bgcolor: "#667eea" }}>
                            <Person />
                          </Avatar>
                          <Typography variant="body1" fontWeight="600">
                            {details.owner.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 6 }}>
                          <Email sx={{ fontSize: 20, color: "#667eea" }} />
                          <Typography variant="body2" color="text.secondary">
                            {details.owner.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Action Buttons */}
                    {token ? (
                      <Box
                        sx={{
                          overflowX: { xs: "auto", md: "visible" },
                          width: "100%",
                          py: 2,
                          "&::-webkit-scrollbar": {
                            height: 8,
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "#f1f1f1",
                            borderRadius: 10,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#667eea",
                            borderRadius: 10,
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            width: "max-content",
                            minWidth: "100%",
                            justifyContent: { xs: "flex-start", md: "center" },
                          }}
                        >
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={handleCarEdit}
                            sx={{
                              minWidth: 150,
                              borderRadius: 2,
                              borderColor: "#667eea",
                              color: "#667eea",
                              fontWeight: 600,
                              transition: "all 0.3s",
                              "&:hover": {
                                borderColor: "#667eea",
                                bgcolor: "rgba(102, 126, 234, 0.1)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                              },
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="contained"
                            startIcon={<ShoppingCartCheckoutIcon />}
                            onClick={handleBuy}
                            sx={{
                              minWidth: 150,
                              borderRadius: 2,
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              fontWeight: 600,
                              transition: "all 0.3s",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                              },
                            }}
                          >
                            Buy Now
                          </Button>

                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteCar}
                            sx={{
                              minWidth: 150,
                              borderRadius: 2,
                              fontWeight: 600,
                              transition: "all 0.3s",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 20px rgba(245, 87, 108, 0.4)",
                              },
                            }}
                          >
                            Delete
                          </Button>

                          <Button
                            variant="outlined"
                            startIcon={<AttachMoneyIcon />}
                            onClick={handleCarLoan}
                            sx={{
                              minWidth: 150,
                              borderRadius: 2,
                              borderColor: "#11998e",
                              color: "#11998e",
                              fontWeight: 600,
                              transition: "all 0.3s",
                              "&:hover": {
                                borderColor: "#11998e",
                                bgcolor: "rgba(17, 153, 142, 0.1)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(17, 153, 142, 0.3)",
                              },
                            }}
                          >
                            Car Loan
                          </Button>

                          <Button
                            variant="outlined"
                            startIcon={<CalculateIcon />}
                            onClick={() => setOpenModal(true)}
                            sx={{
                              minWidth: 150,
                              borderRadius: 2,
                              borderColor: "#f5576c",
                              color: "#f5576c",
                              fontWeight: 600,
                              transition: "all 0.3s",
                              "&:hover": {
                                borderColor: "#f5576c",
                                bgcolor: "rgba(245, 87, 108, 0.1)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(245, 87, 108, 0.3)",
                              },
                            }}
                          >
                            On-Road Price
                          </Button>
                        </Stack>
                      </Box>
                    ) : (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          textAlign: "center",
                          background: "linear-gradient(135deg, rgba(245, 87, 108, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)",
                          borderRadius: 3,
                          border: "2px dashed rgba(245, 87, 108, 0.3)",
                        }}
                      >
                        <Typography variant="h6" color="#f5576c" fontWeight="600">
                          Please log in to perform actions
                        </Typography>
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              </Zoom>

              {/* On-Road Price Modal */}
              <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Fade in={openModal}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: { xs: "90%", sm: 450 },
                      maxWidth: 500,
                    }}
                  >
                    <Paper
                      elevation={24}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: "white",
                        position: "relative",
                      }}
                    >
                      <IconButton
                        onClick={() => setOpenModal(false)}
                        sx={{
                          position: "absolute",
                          right: 8,
                          top: 8,
                          color: "#667eea",
                        }}
                      >
                        <Close />
                      </IconButton>

                      <Box textAlign="center" mb={3}>
                        <CalculateIcon sx={{ fontSize: 50, color: "#667eea", mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold" color="#667eea">
                          On-Road Price Calculation
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 2,
                            bgcolor: "rgba(102, 126, 234, 0.05)",
                            borderRadius: 2,
                          }}
                        >
                          <Typography fontWeight="600">Car Price:</Typography>
                          <Typography fontWeight="600">₹{details.price.toLocaleString("en-IN")}</Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 2,
                            bgcolor: "rgba(102, 126, 234, 0.05)",
                            borderRadius: 2,
                          }}
                        >
                          <Typography>RTO (10%):</Typography>
                          <Typography>₹{(details.price * 0.1).toLocaleString("en-IN")}</Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 2,
                            bgcolor: "rgba(102, 126, 234, 0.05)",
                            borderRadius: 2,
                          }}
                        >
                          <Typography>Insurance (1%):</Typography>
                          <Typography>₹{(details.price * 0.01).toLocaleString("en-IN")}</Typography>
                        </Box>

                        <Divider />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 2.5,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: 2,
                            color: "white",
                          }}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            Total:
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            ₹{(details.price * 1.11).toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setOpenModal(false)}
                        sx={{
                          mt: 3,
                          py: 1.5,
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontWeight: "bold",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                          },
                        }}
                      >
                        Close
                      </Button>
                    </Paper>
                  </Box>
                </Fade>
              </Modal>

              {/* Reviews Section */}
              <Box sx={{ mt: 4 }}>
                <ReviewsForm refresh={() => setRefreshTrigger(!refreshTrigger)} />

                <Box sx={{ mt: 5 }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    mb={4}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Customer Reviews
                  </Typography>

                  {details.reviews.length === 0 ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 5,
                        textAlign: "center",
                        borderRadius: 3,
                        background: "rgba(102, 126, 234, 0.05)",
                      }}
                    >
                      <Typography variant="h6" color="text.secondary">
                        No reviews yet. Be the first to review!
                      </Typography>
                    </Paper>
                  ) : (
                    <Grid container spacing={3}>
                      {details.reviews.map((review, index) => (
                        <Grid item xs={12} key={review._id}>
                          <Zoom in={mounted} timeout={600 + index * 100}>
                            <Card
                              sx={{
                                borderRadius: 3,
                                overflow: "hidden",
                                transition: "all 0.3s",
                                border: "1px solid rgba(102, 126, 234, 0.1)",
                                "&:hover": {
                                  transform: "translateX(8px)",
                                  boxShadow: "0 12px 30px rgba(102, 126, 234, 0.15)",
                                  border: "1px solid rgba(102, 126, 234, 0.3)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: { xs: "column", md: "row" },
                                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                                }}
                              >
                                {/* Left Section - User Info */}
                                <Box
                                  sx={{
                                    minWidth: { md: 250 },
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: { xs: "center", md: "flex-start" },
                                    gap: 2,
                                    borderRight: { md: "1px solid rgba(102, 126, 234, 0.1)" },
                                    borderBottom: { xs: "1px solid rgba(102, 126, 234, 0.1)", md: "none" },
                                    bgcolor: { xs: "transparent", md: "rgba(255, 255, 255, 0.5)" },
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: "#667eea",
                                      width: 60,
                                      height: 60,
                                      fontSize: "1.5rem",
                                      fontWeight: "bold",
                                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                                    }}
                                  >
                                    {review.author?.name?.charAt(0).toUpperCase() || "A"}
                                  </Avatar>
                                  <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                                    <Typography fontWeight="bold" variant="h6">
                                      {review.author?.name || "Anonymous"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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
                                    size="large"
                                    sx={{
                                      "& .MuiRating-iconFilled": {
                                        color: "#667eea",
                                      },
                                    }}
                                  />
                                </Box>

                                {/* Right Section - Review Content */}
                                <Box
                                  sx={{
                                    flex: 1,
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                      sx={{
                                        lineHeight: 1.8,
                                        fontSize: "1rem",
                                      }}
                                    >
                                      {review.comment}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      startIcon={<DeleteIcon />}
                                      onClick={() => handleDeleteReview(review._id)}
                                      sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        px: 3,
                                        transition: "all 0.3s",
                                        "&:hover": {
                                          transform: "translateY(-2px)",
                                          boxShadow: "0 4px 12px rgba(245, 87, 108, 0.3)",
                                        },
                                      }}
                                    >
                                      Delete Review
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Card>
                          </Zoom>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default CarsDetailed;
