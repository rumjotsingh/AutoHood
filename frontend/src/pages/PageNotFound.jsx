import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Fade,
  Stack,
} from "@mui/material";
import { 
  Home, 
  Search, 
  DirectionsCar,
  SentimentVeryDissatisfied,
} from "@mui/icons-material";
import Navbar from './../components/Navbar';
import Footer from './../components/Footer';

const PageNotFound = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Fade in={mounted} timeout={600}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 5, md: 8 },
            }}
          >
            {/* Left - Content */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              {/* 404 Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 1,
                  borderRadius: '50px',
                  bgcolor: '#FEF2F2',
                  color: '#EF4444',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                <SentimentVeryDissatisfied sx={{ fontSize: 20 }} />
                Error 404
              </Box>

              <Typography
                variant="h1"
                fontWeight={800}
                color="#0F172A"
                sx={{
                  fontSize: { xs: '4rem', md: '8rem' },
                  lineHeight: 1,
                  mb: 2,
                  background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                404
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="#0F172A"
                sx={{ 
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  mb: 2,
                }}
              >
                Oops! Page Not Found
              </Typography>

              <Typography
                variant="body1"
                color="#64748B"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: 500,
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                The page you#39;re looking for doesn&#39;t exist or has been moved. 
                Maybe it was just a detour on your journey to find the perfect car!
              </Typography>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  startIcon={<Home />}
                  sx={{
                    px: 4,
                    py: 1.75,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                    "&:hover": {
                      background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Take Me Home
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{
                    px: 4,
                    py: 1.75,
                    borderRadius: '14px',
                    borderColor: '#E2E8F0',
                    borderWidth: 2,
                    color: '#0F172A',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    "&:hover": {
                      borderColor: '#F97316',
                      borderWidth: 2,
                      bgcolor: '#FFF7ED',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Go Back
                </Button>
              </Stack>

              {/* Quick Links */}
              <Box sx={{ mt: 6 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#0F172A" mb={2}>
                  Quick Links
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                  {[
                    { icon: <DirectionsCar sx={{ fontSize: 18 }} />, label: 'Browse Cars', link: '/' },
                    { icon: <Search sx={{ fontSize: 18 }} />, label: 'Search', link: '/' },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="text"
                      onClick={() => navigate(item.link)}
                      startIcon={item.icon}
                      sx={{
                        color: '#64748B',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          color: '#F97316',
                          bgcolor: 'transparent',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Right - Illustration */}
            <Box 
              sx={{ 
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: 'white',
                  border: '1px solid #E2E8F0',
                  maxWidth: 450,
                  width: '100%',
                }}
              >
                <Box
                  component="img"
                  src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg"
                  alt="Page Not Found"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                  }}
                />
              </Paper>
            </Box>
          </Box>
        </Fade>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default PageNotFound;
