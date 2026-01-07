import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
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
  Slide,
  IconButton,
  Chip,
} from "@mui/material";
import { CloudUpload, Edit, ArrowBack } from "@mui/icons-material";
import { API_ENDPOINTS } from '../config/api';
const EditPage = () => {
  const {id}=useParams();
  const navigate=useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    setFile(e.target.files[0]);
    
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
      const token=localStorage.getItem('token');
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
      toast.success(" Car Update SucessFull",{
        autoClose:3000
      });
      setTimeout(() => {
        navigate('/')
      }, 4000);
      setFile(null);
    } catch (err) {
      toast.error(err.status ?  "You are not the owner of this listing!" : "")
    } finally {
      setLoading(false);
    }}
    return (
    <>
      <Navbar/>
      <Fade in={mounted} timeout={800}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            py: { xs: 4, md: 8 },
            px: { xs: 2, md: 0 },
          }}
        >
          <Container maxWidth="md">
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  position: "absolute",
                  left: { xs: 16, md: 32 },
                  top: { xs: 80, md: 100 },
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  "&:hover": {
                    bgcolor: "white",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s",
                }}
              >
                <ArrowBack />
              </IconButton>
              <Slide direction="down" in={mounted} timeout={600}>
                <Box>
                  <Edit sx={{ fontSize: { xs: 50, md: 60 }, color: "white", mb: 2 }} />
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color="white"
                    sx={{
                      fontSize: { xs: '2rem', md: '3rem' },
                      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    Update Car Listing
                  </Typography>
                  <Typography variant="body1" color="white" sx={{ opacity: 0.9, mt: 1 }}>
                    Edit your car details below
                  </Typography>
                </Box>
              </Slide>
            </Box>

            {/* Form */}
            <Slide direction="up" in={mounted} timeout={800}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField
                      label="Engine"
                      variant="outlined"
                      fullWidth
                      {...register("engine", { required: "Engine is required" })}
                      error={!!errors.engine}
                      helperText={errors.engine?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Company"
                      variant="outlined"
                      fullWidth
                      {...register("company", { required: "Company is required" })}
                      error={!!errors.company}
                      helperText={errors.company?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      {...register("description", { required: "Description is required" })}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Color"
                      variant="outlined"
                      fullWidth
                      {...register("color", { required: "Color is required" })}
                      error={!!errors.color}
                      helperText={errors.color?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Mileage"
                      variant="outlined"
                      fullWidth
                      type="number"
                      {...register("mileage", {
                        required: "Mileage is required",
                        valueAsNumber: true,
                      })}
                      error={!!errors.mileage}
                      helperText={errors.mileage?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Price"
                      variant="outlined"
                      fullWidth
                      type="number"
                      {...register("price", {
                        required: "Price is required",
                        valueAsNumber: true,
                      })}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                        },
                      }}
                    />
                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        startIcon={<CloudUpload />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          borderColor: "#667eea",
                          color: "#667eea",
                          transition: "all 0.3s",
                          "&:hover": {
                            borderColor: "#764ba2",
                            bgcolor: "rgba(102, 126, 234, 0.05)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Upload Car Image
                        <input
                          type="file"
                          hidden
                          name="carListing"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Button>
                      {file && (
                        <Chip
                          label={`Selected: ${file.name}`}
                          onDelete={() => setFile(null)}
                          color="primary"
                          sx={{ mt: 2 }}
                        />
                      )}
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                        },
                        "&:disabled": {
                          background: "rgba(102, 126, 234, 0.5)",
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update Car Listing"}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Container>
        </Box>
      </Fade>
      <Footer/>
   </>
  )
}
export default EditPage
