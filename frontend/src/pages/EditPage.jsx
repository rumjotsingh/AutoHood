import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Fade,
  IconButton,
  Chip,
  Grid,
  InputAdornment,
  Breadcrumbs,
  Stack,
} from "@mui/material";
import { 
 
  Edit, 
  ArrowBack, 
  Home,
  NavigateNext,
  Speed,
  DirectionsCar,
  Description,
  ColorLens,
  LocalGasStation,
  AttachMoney,
  Image,
  CheckCircle,
} from "@mui/icons-material";
import { API_ENDPOINTS } from '../config/api';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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
      await axios.put(
        `${API_ENDPOINTS.CARS.UPDATE.replace(':id', id)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        },
      );
      reset();
      toast.success("Car Updated Successfully", {
        autoClose: 3000
      });
      setTimeout(() => {
        navigate('/')
      }, 4000);
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error(err.status ? "You are not the owner of this listing!" : "Update failed")
    } finally {
      setLoading(false);
    }
  };

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
            <Link 
              to={`/car/${id}`} 
              style={{ textDecoration: 'none' }}
            >
              <Typography variant="body2" color="#64748B">Car Details</Typography>
            </Link>
            <Typography variant="body2" color="#0F172A" fontWeight={600}>
              Edit Listing
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Fade in={mounted} timeout={600}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  bgcolor: 'white',
                  border: '1px solid #E2E8F0',
                  "&:hover": {
                    bgcolor: '#FFF7ED',
                    borderColor: '#F97316',
                  },
                }}
              >
                <ArrowBack sx={{ color: '#0F172A' }} />
              </IconButton>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="#0F172A"
                  sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  Update Car Listing
                </Typography>
                <Typography variant="body1" color="#64748B">
                  Edit your car details below
                </Typography>
              </Box>
            </Box>

            {/* Form */}
            <Grid container spacing={4}>
              {/* Left Column - Image Upload */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                    height: '100%',
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
                      height: 280,
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
                            width: 64,
                            height: 64,
                            borderRadius: '16px',
                            bgcolor: '#FFF7ED',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                          }}
                        >
                          <Image sx={{ fontSize: 32, color: '#F97316' }} />
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

                  {/* Tips */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="#0F172A" gutterBottom>
                      Tips for better photos
                    </Typography>
                    <Stack spacing={1.5} mt={2}>
                      {[
                        'Use natural lighting for best results',
                        'Take photos from multiple angles',
                        'Ensure the car is clean and presentable',
                        'Include both interior and exterior shots',
                      ].map((tip, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: '#F97316',
                            }}
                          />
                          <Typography variant="caption" color="#64748B">
                            {tip}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
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
                    Fill in the updated information about your car
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
                          label="Price"
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
                                <AttachMoney sx={{ color: '#94A3B8', fontSize: 20 }} />
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
                          startIcon={!loading && <Edit />}
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
                            "Update Car Listing"
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
};

export default EditPage;
