import { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
  Grow, 
  Slide 
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { 
  Visibility, 
  VisibilityOff, 
  PersonAdd as RegisterIcon 
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser, googleLogin } from '../redux/actions/authActions';
import { jwtDecode } from "jwt-decode";

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
        autoClose: 3000,
      });
      return;
    }

    const result = await dispatch(registerUser(form));

    if (result.type === 'auth/register/fulfilled') {
      toast.success("Registration Successful! Please log in.", {
        position: "top-right",
        autoClose: 4000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      toast.error(result.payload || "Registration Not Successful", {
        position: "top-center",
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
        position: "top-center",
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
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
                    <RegisterIcon sx={{ fontSize: 60, color: "#f5576c", mb: 2 }} />
                  </Grow>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Create Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Join AutoHood today and find your dream car
                  </Typography>
                </Box>

                <GoogleOAuthProvider clientId={Client}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Full Name"
                      type="text"
                      margin="normal"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(245, 87, 108, 0.2)",
                          },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      margin="normal"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(245, 87, 108, 0.2)",
                          },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      margin="normal"
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: "" });
                      }}
                      error={!!errors.password}
                      helperText={errors.password}
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
                            boxShadow: "0 4px 12px rgba(245, 87, 108, 0.2)",
                          },
                        },
                      }}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      onClick={handleRegister}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(245, 87, 108, 0.4)",
                        },
                        "&:disabled": {
                          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                          opacity: 0.6,
                        },
                      }}
                    >
                      {loading ? "Creating Account..." : "Sign Up"}
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
                        text="signup_with"
                        shape="rectangular"
                      />
                    </Box>

                    <Box textAlign="center" mt={3}>
                      <Typography variant="body2" color="text.secondary">
                        Already have an account?{" "}
                        <Button
                          onClick={() => navigate("/login")}
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            color: "#f5576c",
                            "&:hover": {
                              background: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Sign In
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

export default Register;
