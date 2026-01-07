import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Grid,
  InputAdornment,
  Chip,
  Stack,
  Fade,
  Breadcrumbs,
} from "@mui/material";
import {
  CloudUpload,
  DirectionsCar,
  Speed,
  Description,
  ColorLens,
  LocalGasStation,
  CheckCircle,
  Home,
  NavigateNext,
  Add,
  Verified,
  TrendingUp,
  People,
} from "@mui/icons-material";

function CarsForm() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("carListing", file);
    formData.append("engine", data.engine);
    formData.append("company", data.company);
    formData.append("description", data.description);
    formData.append("color", data.color);
    formData.append("mileage", data.mileage);
    formData.append("price", data.price);
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        "http://localhost:8080/api/v1/cars/new-car",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        },
      );
      reset();
      toast.success("Car Listed Successfully!");
      setFile(null);
      setPreviewUrl(null);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      toast.error("Failed to create car listing");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to login first", { position: "top-center", autoClose: 5000 });
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: '12px',
      bgcolor: '#F8FAFC',
      transition: 'all 0.3s',
      "& fieldset": {
        borderColor: '#E2E8F0',
      },
      "&:hover fieldset": {
        borderColor: '#F97316',
      },
      "&.Mui-focused fieldset": {
        borderColor: '#F97316',
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: '#F97316',
    },
  };

  const benefits = [
    { icon: <TrendingUp />, text: 'Reach millions of potential buyers' },
    { icon: <Verified />, text: 'Get verified listing badge' },
    { icon: <People />, text: 'Connect with serious buyers' },
  ];

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
              Sell Your Car
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Fade in={mounted} timeout={600}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 12px 40px rgba(249, 115, 22, 0.3)',
                }}
              >
                <DirectionsCar sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography
                variant="h3"
                fontWeight={800}
                color="#0F172A"
                sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
              >
                Sell Your Car
              </Typography>
              <Typography variant="body1" color="#64748B" sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
                List your car in minutes and reach thousands of potential buyers
              </Typography>
            </Box>

            {/* Form */}
            <Grid container spacing={4}>
              {/* Left Column - Benefits & Image Upload */}
              <Grid item xs={12} md={5}>
                {/* Benefits Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    mb: 3,
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
                  
                  <Typography variant="h6" fontWeight={700} color="white" gutterBottom sx={{ position: 'relative' }}>
                    Why Sell on AutoHood?
                  </Typography>
                  <Stack spacing={2.5} sx={{ mt: 3, position: 'relative' }}>
                    {benefits.map((benefit, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            bgcolor: 'rgba(249, 115, 22, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#F97316',
                          }}
                        >
                          {benefit.icon}
                        </Box>
                        <Typography variant="body2" color="white">
                          {benefit.text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                {/* Image Upload Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                    Car Image
                  </Typography>
                  <Typography variant="body2" color="#64748B" mb={3}>
                    Upload a high-quality image of your car
                  </Typography>

                  {/* Image Preview */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 240,
                      borderRadius: '16px',
                      border: '2px dashed #E2E8F0',
                      bgcolor: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#F97316',
                        bgcolor: '#FFF7ED',
                      },
                    }}
                    component="label"
                  >
                    {previewUrl ? (
                      <Box
                        component="img"
                        src={previewUrl}
                        alt="Preview"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '14px',
                            bgcolor: '#FFF7ED',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                          }}
                        >
                          <CloudUpload sx={{ fontSize: 28, color: '#F97316' }} />
                        </Box>
                        <Typography variant="subtitle2" fontWeight={600} color="#0F172A">
                          Click to upload
                        </Typography>
                        <Typography variant="caption" color="#64748B">
                          PNG, JPG up to 10MB
                        </Typography>
                      </>
                    )}
                    <input
                      type="file"
                      hidden
                      name="carListing"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Box>

                  {file && (
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 18 }} />}
                      label={file.name}
                      onDelete={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      sx={{
                        mt: 2,
                        bgcolor: '#F0FDF4',
                        color: '#166534',
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': {
                          color: '#166534',
                        },
                      }}
                    />
                  )}
                </Paper>
              </Grid>

              {/* Right Column - Form Fields */}
              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                    Car Details
                  </Typography>
                  <Typography variant="body2" color="#64748B" mb={4}>
                    Fill in the information about your car
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Engine Type"
                          variant="outlined"
                          fullWidth
                          placeholder="e.g., Petrol, Diesel, Electric"
                          {...register("engine", { required: "Engine is required" })}
                          error={!!errors.engine}
                          helperText={errors.engine?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Speed sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputStyles}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Company/Model"
                          variant="outlined"
                          fullWidth
                          placeholder="e.g., Toyota Camry"
                          {...register("company", { required: "Company is required" })}
                          error={!!errors.company}
                          helperText={errors.company?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DirectionsCar sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputStyles}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                          placeholder="Describe your car's condition, features, and history..."
                          {...register("description", { required: "Description is required" })}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                <Description sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputStyles}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Color"
                          variant="outlined"
                          fullWidth
                          placeholder="e.g., White, Black, Silver"
                          {...register("color", { required: "Color is required" })}
                          error={!!errors.color}
                          helperText={errors.color?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ColorLens sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputStyles}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Mileage"
                          variant="outlined"
                          fullWidth
                          type="number"
                          placeholder="e.g., 25"
                          {...register("mileage", {
                            required: "Mileage is required",
                            valueAsNumber: true,
                          })}
                          error={!!errors.mileage}
                          helperText={errors.mileage?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalGasStation sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography variant="caption" color="#94A3B8">km/l</Typography>
                              </InputAdornment>
                            ),
                          }}
                          sx={inputStyles}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Ex-Showroom Price"
                          variant="outlined"
                          fullWidth
                          type="number"
                          placeholder="e.g., 1500000"
                          {...register("price", {
                            required: "Price is required",
                            valueAsNumber: true,
                          })}
                          error={!!errors.price}
                          helperText={errors.price?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography variant="body2" color="#94A3B8" fontWeight={600}>₹</Typography>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography variant="caption" color="#94A3B8">INR</Typography>
                              </InputAdornment>
                            ),
                          }}
                          sx={inputStyles}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={loading}
                          startIcon={!loading && <Add />}
                          sx={{
                            py: 1.75,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                            transition: 'all 0.3s',
                            "&:hover": {
                              background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
                            },
                            "&:disabled": {
                              background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                              opacity: 0.7,
                            },
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={24} sx={{ color: "white" }} />
                          ) : (
                            "Create Listing"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
      
      <Footer />
    </Box>
  );
}

export default CarsForm;
