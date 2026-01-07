import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
  Grow,
  Slide,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
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

  return (
    <>
      <Navbar />
      <Fade in={mounted} timeout={800}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 4, md: 8 },
            px: { xs: 2, md: 0 },
          }}
        >
          <Container maxWidth="sm">
            <Slide direction="up" in={mounted} timeout={600}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                <Box textAlign="center" mb={4}>
                  <Grow in={mounted} timeout={1000}>
                    <LoginIcon sx={{ fontSize: { xs: 50, md: 60 }, color: "#667eea", mb: 2 }} />
                  </Grow>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '1.75rem', md: '2.125rem' },
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Sign in to continue to AutoHood
                  </Typography>
                </Box>

                <GoogleOAuthProvider clientId={Client}>
                  <Box component="form" onSubmit={handleSubmit(handleLogin)}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      margin="normal"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      margin="normal"
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
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        mb: 2,
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
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          opacity: 0.6,
                        },
                      }}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        my: 3,
                      }}
                    >
                      <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                      <Typography sx={{ px: 2, color: "text.secondary" }}>OR</Typography>
                      <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                    </Box>

                    <Box display="flex" justifyContent="center">
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                          toast.error("Google Login Failed");
                        }}
                        theme="filled_blue"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                      />
                    </Box>

                    <Box textAlign="center" mt={3}>
                      <Typography variant="body2" color="text.secondary">
                        Don&apos;t have an account?{" "}
                        <Button
                          onClick={() => navigate("/register")}
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            color: "#667eea",
                            "&:hover": {
                              background: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Sign Up
                        </Button>
                      </Typography>
                    </Box>
                  </Box>
                </GoogleOAuthProvider>
              </Paper>
            </Slide>
          </Container>
        </Box>
      </Fade>
      <Footer />
    </>
  );
}

export default Login;
