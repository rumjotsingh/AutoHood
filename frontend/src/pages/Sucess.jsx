
import { Container, Typography, Button, Box, Fade, Zoom } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Success = () => {
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
          background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
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
              <CheckCircleIcon 
                sx={{ 
                  fontSize: { xs: 80, md: 100 }, 
                  color: '#11998e',
                  animation: "pulse 2s infinite",
                }} 
              />
              <Typography 
                variant="h3" 
                sx={{ 
                  mt: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 'bold', 
                  color: '#11998e',
                }}
              >
                Payment Successful!
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, color: "text.secondary", fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Thank you for your purchase. Your payment has been processed successfully.
                Your car purchase details will be sent to your email shortly.
              </Typography>
              <Box mt={4}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(17, 153, 142, 0.4)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  Go Back Home
                </Button>
              </Box>
            </Box>
          </Zoom>
        </Container>
      </Box>
    </Fade>
  );
};

export default Success;
