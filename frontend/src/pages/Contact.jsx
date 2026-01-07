import { useState } from "react";
import axios from "axios";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Chip,
  Stack,
  
  InputAdornment,
} from "@mui/material";
import { 
  Email, 
  Phone, 
  LocationOn, 
  Send,
  WhatsApp,
  AccessTime,
  Person,
  Message,
  ArrowForward,
} from '@mui/icons-material';
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
      newErrors.feedback = "Message cannot be empty.";
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
        toast.success(response.data.message || "Message sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFeedback("");
        setEmail("");
        setName("");
        setErrors({});
      } else {
        toast.error(response.data.message || "Failed to send message.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch {
      toast.error("Message not sent. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 28 }} />,
      title: "Email Us",
      content: "support@autohood.com",
      subContent: "We'll respond within 24 hours",
      action: "mailto:support@autohood.com",
    },
    {
      icon: <Phone sx={{ fontSize: 28 }} />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      subContent: "Mon-Sat, 9AM-6PM",
      action: "tel:+15551234567",
    },
    {
      icon: <WhatsApp sx={{ fontSize: 28 }} />,
      title: "WhatsApp",
      content: "+1 (555) 123-4567",
      subContent: "Quick responses",
      action: "https://wa.me/15551234567",
    },
    {
      icon: <LocationOn sx={{ fontSize: 28 }} />,
      title: "Visit Us",
      content: "123 Auto Street",
      subContent: "Car City, CC 12345",
      action: null,
    },
  ];

  const faqItems = [
    {
      question: "How do I list my car for sale?",
      answer: "Simply create an account, click 'Sell Your Car', and follow the easy listing process.",
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, we use industry-standard encryption and secure payment gateways for all transactions.",
    },
    {
      question: "How long does verification take?",
      answer: "Our verification process typically takes 24-48 hours for most listings.",
    },
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: 'white',
          py: { xs: 8, md: 10 },
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" maxWidth={700} mx="auto">
            <Chip 
              label="Get in Touch" 
              sx={{ 
                bgcolor: 'rgba(249, 115, 22, 0.2)', 
                color: '#FB923C',
                fontWeight: 600,
                mb: 3,
                fontSize: '0.85rem',
              }} 
            />
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              We&apos;d Love to
              <Box 
                component="span" 
                sx={{ 
                  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {' '}Hear From You
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#94A3B8',
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Have questions about buying or selling? Our team is here to help you 
              every step of the way.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Cards */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                component={info.action ? 'a' : 'div'}
                href={info.action || undefined}
                target={info.action?.startsWith('http') ? '_blank' : undefined}
                rel={info.action?.startsWith('http') ? 'noopener noreferrer' : undefined}
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  bgcolor: 'white',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: info.action ? 'pointer' : 'default',
                  '&:hover': info.action ? {
                    borderColor: '#F97316',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(249, 115, 22, 0.15)',
                    '& .contact-icon': {
                      background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                      color: 'white',
                    },
                  } : {},
                }}
              >
                <Box
                  className="contact-icon"
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '14px',
                    bgcolor: '#FFF7ED',
                    color: '#F97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'all 0.3s',
                    flexShrink: 0,
                  }}
                >
                  {info.icon}
                </Box>
                <Typography 
                  variant="subtitle1" 
                  fontWeight={600} 
                  color="#0F172A" 
                  gutterBottom
                  sx={{ width: '100%' }}
                >
                  {info.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={500} 
                  color="#0F172A"
                  sx={{ 
                    width: '100%',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    fontSize: '0.875rem',
                  }}
                >
                  {info.content}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="#64748B"
                  sx={{ 
                    display: 'block',
                    width: '100%',
                    mt: 0.5,
                  }}
                >
                  {info.subContent}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Main Content */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  bgcolor: 'white',
                }}
              >
                <Box mb={4}>
                  <Typography variant="h4" fontWeight={700} color="#0F172A" gutterBottom>
                    Send Us a Message
                  </Typography>
                  <Typography variant="body1" color="#64748B">
                    Fill out the form below and we&#39;ll get back to you as soon as possible.
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
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
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#F97316',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#F97316',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#F97316',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
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
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#F97316',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#F97316',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#F97316',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        placeholder="How can we help you?"
                        multiline
                        rows={5}
                        value={feedback}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                          if (errors.feedback) setErrors({ ...errors, feedback: "" });
                        }}
                        error={!!errors.feedback}
                        helperText={errors.feedback}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                              <Message sx={{ color: '#94A3B8', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#F97316',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#F97316',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#F97316',
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
                        endIcon={<Send />}
                        sx={{
                          py: 1.75,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                          fontWeight: 600,
                          fontSize: '1rem',
                          textTransform: 'none',
                          boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
                          },
                          '&:disabled': {
                            background: '#E2E8F0',
                            color: '#94A3B8',
                          },
                        }}
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Side Content */}
            <Grid item xs={12} md={5}>
              {/* Support Hours */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mb: 3,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      bgcolor: 'rgba(249, 115, 22, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccessTime sx={{ color: '#FB923C', fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Support Hours
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                      We&#39;re here when you need us
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                      Monday - Friday
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      9:00 AM - 8:00 PM
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                      Saturday
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      10:00 AM - 6:00 PM
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                      Sunday
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      Closed
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* FAQ Section */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  bgcolor: 'white',
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                  Frequently Asked Questions
                </Typography>

                <Stack spacing={3} mt={3}>
                  {faqItems.map((item, index) => (
                    <Box key={index}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={600} 
                        color="#0F172A"
                        sx={{ mb: 0.5 }}
                      >
                        {item.question}
                      </Typography>
                      <Typography variant="body2" color="#64748B" lineHeight={1.7}>
                        {item.answer}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    borderWidth: 2,
                    color: '#0F172A',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#F97316',
                      borderWidth: 2,
                      bgcolor: '#FFF7ED',
                    },
                  }}
                >
                  View All FAQs
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* WhatsApp CTA */}
      <Box sx={{ py: 4, bgcolor: 'white', borderTop: '1px solid #E2E8F0' }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WhatsApp sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Need Quick Assistance?
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Chat with us on WhatsApp for instant support
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              component="a"
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: 'white',
                color: '#128C7E',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                flexShrink: 0,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Start Chat
            </Button>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default Contact;
