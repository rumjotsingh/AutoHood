import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { 
  Visibility, 
  VisibilityOff, 
} from "@mui/icons-material";
import { useAppSelector } from '../redux/hooks';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
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
    try {
      const res = await axios.post("https://carsystem-backend.onrender.com/api/v1/auth/login", {
        email: data.email,
        password: data.password,
      });
      if (res.data.message) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      toast.error("Login not successful", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Login Error:", err);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 10,mb:10 ,textAlign: "center" }}>
     
          <Box
            sx={{
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "white",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit(handleLogin)}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                {...register("password", {
                  required: "Password is required",
                  
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
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
            <br></br>
          
           
          </Box>
       
      </Container>
      <Footer />
    </>
  );
}
export default Login;
