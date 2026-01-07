import { useState } from "react";
import axios from "axios";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  
  Fade,
  Zoom,
  Paper,
} from "@mui/material";
import { Email, Phone, LocationOn, Send } from '@mui/icons-material';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import API_ENDPOINTS from '../config/api';

function Contact() {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    let newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!feedback.trim()) {
      newErrors.feedback = "Feedback message cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.FEEDBACK.CREATE, {
        feedback,
        email,
        name,
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Feedback sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFeedback("");
        setEmail("");
        setName("");
        setErrors({});
      } else {
        toast.error(response.data.message || "Failed to send feedback.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch {
      toast.error("Feedback Not Sent. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Container maxWidth="lg">
          <Fade in={mounted} timeout={800}>
            <Box textAlign="center" mb={6}>
              <Typography
                variant="h2"
                fontWeight="bold"
                color="white"
                gutterBottom
                sx={{ 
                  fontSize: { xs: '2rem', md: '3.75rem' },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)" 
                }}
              >
                Get In Touch
              </Typography>
              <Typography 
                variant="h6" 
                color="white" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                We&#39;d love to hear from you
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {/* Contact Information Cards */}
            <Grid item xs={12} md={4}>
              <Zoom in={mounted} timeout={600}>
                <Paper
                  elevation={10}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    height: "100%",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-10px)",
                    },
                  }}
                >
                  <Email sx={{ fontSize: 50, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Email Us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@autohood.com
                  </Typography>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={4}>
              <Zoom in={mounted} timeout={800}>
                <Paper
                  elevation={10}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    height: "100%",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-10px)",
                    },
                  }}
                >
                  <Phone sx={{ fontSize: 50, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Call Us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +1 (555) 123-4567
                  </Typography>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={4}>
              <Zoom in={mounted} timeout={1000}>
                <Paper
                  elevation={10}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    height: "100%",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-10px)",
                    },
                  }}
                >
                  <LocationOn sx={{ fontSize: 50, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Visit Us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    123 Auto Street, Car City
                  </Typography>
                </Paper>
              </Zoom>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12}>
              <Fade in={mounted} timeout={1200}>
                <Paper
                  elevation={20}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
                    Send Us a Message
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          error={!!errors.name}
                          helperText={errors.name}
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
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: "" });
                          }}
                          error={!!errors.email}
                          helperText={errors.email}
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
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Message"
                          multiline
                          rows={6}
                          value={feedback}
                          onChange={(e) => {
                            setFeedback(e.target.value);
                            if (errors.feedback) setErrors({ ...errors, feedback: "" });
                          }}
                          error={!!errors.feedback}
                          helperText={errors.feedback}
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
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={loading}
                          startIcon={<Send />}
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
                          }}
                        >
                          {loading ? "Sending..." : "Send Message"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default Contact;
