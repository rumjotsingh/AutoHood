import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
// ...existing code...
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
  Email,
  Lock,
  ArrowForward,
  Security,
  Speed,
  Verified,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { loginUser } from '../redux/actions/authActions';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ...existing code...
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      const result = await dispatch(loginUser({
        email: data.email,
        password: data.password,
      }));
      
      if (result.type === 'auth/login/fulfilled') {
        toast.success("Login successful", {
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
    } catch (err) {
      toast.error("Login not successful", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  const benefits = [
    { icon: <Security />, title: "Secure Login", desc: "Your data is protected with industry-standard encryption" },
    { icon: <Speed />, title: "Quick Access", desc: "Fast and seamless login experience" },
    { icon: <Verified />, title: "Verified Users", desc: "Connect with trusted buyers and sellers" },
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
                  Welcome Back
                  <Box 
                    component="span" 
                    sx={{ 
                      color: '#F97316',
                      display: 'block',
                    }}
                  >
                    To AutoHood
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
                  Sign in to access your account, manage your listings, and explore thousands of vehicles.
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
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="#64748B" mb={4}>
                    Enter your credentials to continue
                  </Typography>

                  <form onSubmit={handleSubmit(handleLogin)}>
                      {/* Email Field */}
                      <Box sx={{ mb: 2.5 }}>
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
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Invalid email address",
                            },
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
                        fullWidth
                        type="submit"
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
                          "Signing In..."
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      {/* Divider */}
                     

                      {/* ...Google Login removed... */}

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
                            Sign Up
                          </Link>
                        </Typography>
                      </Box>
                    </form>
                  {/* ...GoogleOAuthProvider removed... */}
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
