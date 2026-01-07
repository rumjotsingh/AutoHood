import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Fade,
  
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { 
  Visibility, 
  VisibilityOff, 
  DirectionsCar,
  Email,
  Lock,
  ArrowForward,
  Security,
  Speed,
  Verified,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser, googleLogin } from '../redux/actions/authActions';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    const result = await dispatch(loginUser({
      email: data.email,
      password: data.password,
    }));

    if (result.type === 'auth/login/fulfilled') {
      toast.success("Login successful! Welcome back!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error(result.payload || "Login not successful", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const jwt = credentialResponse.credential;
    const payload = jwtDecode(jwt);

    const result = await dispatch(googleLogin({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
    }));

    if (result.type === 'auth/googleLogin/fulfilled') {
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error("Google Login Failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const features = [
    { icon: <Speed />, title: "Quick Access", desc: "Get instant access to thousands of car listings" },
    { icon: <Verified />, title: "Verified Sellers", desc: "All our sellers are verified for your safety" },
    { icon: <Security />, title: "Secure Payments", desc: "Your transactions are protected and encrypted" },
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
                minHeight: { md: 600 },
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
                  Welcome Back to Your
                  <Box 
                    component="span" 
                    sx={{ 
                      color: '#F97316',
                      display: 'block',
                    }}
                  >
                    Dream Car Journey
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
                  Sign in to access your account, manage listings, and continue your search for the perfect vehicle.
                </Typography>

                {/* Features */}
                <Stack spacing={3} sx={{ position: 'relative' }}>
                  {features.map((feature, index) => (
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
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} color="white">
                          {feature.title}
                        </Typography>
                        <Typography variant="caption" color="#94A3B8">
                          {feature.desc}
                        </Typography>
                      </Box>
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
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="#64748B" mb={4}>
                    Enter your credentials to access your account
                  </Typography>

                  <GoogleOAuthProvider clientId={Client}>
                    <Box component="form" onSubmit={handleSubmit(handleLogin)}>
                      {/* Email Field */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="#0F172A" mb={1}>
                          Email Address
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="you@example.com"
                          type="email"
                          {...register("email", { 
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          })}
                          error={!!errors.email}
                          helperText={errors.email?.message}
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
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          {...register("password", { 
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters"
                            }
                          })}
                          error={!!errors.password}
                          helperText={errors.password?.message}
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
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
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
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      {/* Divider */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: 3,
                        }}
                      >
                        <Divider sx={{ flex: 1 }} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            px: 2, 
                            color: '#94A3B8',
                            fontWeight: 500,
                          }}
                        >
                          or continue with
                        </Typography>
                        <Divider sx={{ flex: 1 }} />
                      </Box>

                      {/* Google Login */}
                      <Box display="flex" justifyContent="center">
                        <GoogleLogin
                          onSuccess={handleGoogleLogin}
                          onError={() => {
                            toast.error("Google Login Failed");
                          }}
                          theme="outline"
                          size="large"
                          text="signin_with"
                          shape="rectangular"
                          width="100%"
                        />
                      </Box>

                      {/* Register Link */}
                      <Box textAlign="center" mt={4}>
                        <Typography variant="body2" color="#64748B">
                          Don&apos;t have an account?{" "}
                          <Link
                            to="/register"
                            style={{
                              color: '#F97316',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            Create Account
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

export default Login;
