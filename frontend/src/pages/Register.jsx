import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Fade, 
  Stack,

} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { 
  Visibility, 
  VisibilityOff, 
  DirectionsCar,  
  Person,
  Email,
  Lock,
  ArrowForward,
  CheckCircle,
  LocalOffer,
  Support,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser } from '../redux/actions/authActions';


function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const Client = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const result = await dispatch(registerUser(form));

    if (result.type === 'auth/register/fulfilled') {
      toast.success("Registration Successful! Please log in.", {
        position: "top-right",
        autoClose: 5000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      toast.error(result.payload || "Registration Not Successful", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  

  const benefits = [
    { icon: <CheckCircle />, title: "Free Listings", desc: "List your car for free and reach millions of buyers" },
    { icon: <LocalOffer />, title: "Best Deals", desc: "Get access to exclusive deals and discounts" },
    { icon: <Support />, title: "24/7 Support", desc: "Our support team is always here to help you" },
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      
      <Box
        sx={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Fade in={mounted} timeout={600}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                minHeight: { md: 650 },
              }}
            >
              {/* Left Side - Branding */}
              <Box
                sx={{
                  flex: { md: '0 0 45%' },
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  p: { xs: 4, md: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
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
                    opacity: 0.1,
                    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5, position: 'relative' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DirectionsCar sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Typography variant="h4" fontWeight={800} color="white">
                    Auto<span style={{ color: '#F97316' }}>Hood</span>
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                  fontWeight={800}
                  color="white"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                    lineHeight: 1.2,
                    mb: 2,
                    position: 'relative',
                  }}
                >
                  Start Your Journey
                  <Box 
                    component="span" 
                    sx={{ 
                      color: '#F97316',
                      display: 'block',
                    }}
                  >
                    With AutoHood
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#94A3B8',
                    mb: 5,
                    lineHeight: 1.8,
                    position: 'relative',
                  }}
                >
                  Create an account to list your car, browse thousands of vehicles, and connect with verified buyers and sellers.
                </Typography>

                {/* Benefits */}
                <Stack spacing={3} sx={{ position: 'relative' }}>
                  {benefits.map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: 'rgba(249, 115, 22, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#F97316',
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} color="white">
                          {benefit.title}
                        </Typography>
                        <Typography variant="caption" color="#94A3B8">
                          {benefit.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>

                {/* Stats */}
                <Stack 
                  direction="row" 
                  spacing={4} 
                  sx={{ 
                    mt: 5, 
                    pt: 4, 
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                  }}
                >
                  {[
                    { number: '10K+', label: 'Cars Listed' },
                    { number: '5K+', label: 'Happy Users' },
                    { number: '99%', label: 'Satisfaction' },
                  ].map((stat, index) => (
                    <Box key={index}>
                      <Typography variant="h5" fontWeight={800} color="#F97316">
                        {stat.number}
                      </Typography>
                      <Typography variant="caption" color="#94A3B8">
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Right Side - Form */}
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 4, md: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  bgcolor: 'white',
                }}
              >
                <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#0F172A"
                    gutterBottom
                    sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                  >
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="#64748B" mb={4}>
                    Fill in your details to get started
                  </Typography>

                  <GoogleOAuthProvider clientId={Client}>
                    <Box>
                      {/* Full Name Field */}
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="#0F172A" mb={1}>
                          Full Name
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="John Doe"
                          type="text"
                          value={form.name}
                          onChange={(e) => {
                            setForm({ ...form, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          error={!!errors.name}
                          helperText={errors.name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
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
                          }}
                        />
                      </Box>

                      {/* Email Field */}
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="#0F172A" mb={1}>
                          Email Address
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="you@example.com"
                          type="email"
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: "" });
                          }}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
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
                          }}
                        />
                      </Box>

                      {/* Password Field */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="#0F172A" mb={1}>
                          Password
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Create a strong password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={(e) => {
                            setForm({ ...form, password: e.target.value });
                            if (errors.password) setErrors({ ...errors, password: "" });
                          }}
                          error={!!errors.password}
                          helperText={errors.password}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ color: '#94A3B8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end" size="small">
                                  {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
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
                          }}
                        />
                      </Box>

                      {/* Submit Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        onClick={handleRegister}
                        endIcon={!loading && <ArrowForward />}
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
                          "Creating Account..."
                        ) : (
                          "Create Account"
                        )}
                      </Button>

                      {/* Terms */}
                      <Typography 
                        variant="caption" 
                        color="#94A3B8" 
                        sx={{ 
                          display: 'block', 
                          textAlign: 'center', 
                          mt: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        By creating an account, you agree to our{' '}
                        <Link to="/policy" style={{ color: '#F97316', textDecoration: 'none' }}>
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link to="/policy" style={{ color: '#F97316', textDecoration: 'none' }}>
                          Privacy Policy
                        </Link>
                      </Typography>

                      {/* Divider */}
                     

                      {/* Google Login */}
                   

                      {/* Login Link */}
                      <Box textAlign="center" mt={4}>
                        <Typography variant="body2" color="#64748B">
                          Already have an account?{" "}
                          <Link
                            to="/login"
                            style={{
                              color: '#F97316',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            Sign In
                          </Link>
                        </Typography>
                      </Box>
                    </Box>
                  </GoogleOAuthProvider>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
}

export default Register;
