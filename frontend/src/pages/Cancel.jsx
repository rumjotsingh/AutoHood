
import { Container, Typography, Button, Box, Fade, Zoom } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Cancel = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Fade in={mounted} timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
        }}
      >
        <Container maxWidth="sm">
          <Zoom in={mounted} timeout={1000}>
            <Box
              sx={{
                textAlign: "center",
                bgcolor: "white",
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <CancelIcon 
                sx={{ 
                  fontSize: { xs: 80, md: 100 }, 
                  color: '#f5576c',
                  animation: "shake 1s",
                }} 
              />
              <Typography 
                variant="h3" 
                sx={{ 
                  mt: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 'bold', 
                  color: '#f5576c',
                }}
              >
                Payment Cancelled
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, color: "text.secondary", fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Looks like you cancelled the payment. You can try again anytime.
              </Typography>
              <Box mt={4}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(245, 87, 108, 0.4)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  Try Again
                </Button>
              </Box>
            </Box>
          </Zoom>
        </Container>
      </Box>
    </Fade>
  );
};

export default Cancel;
