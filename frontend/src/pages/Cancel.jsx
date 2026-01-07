import { Container, Typography, Button, Box, Fade, Paper, Stack } from '@mui/material';
import { Cancel as CancelIcon, Home, Refresh, Support } from '@mui/icons-material';
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
          justifyContent: "center",
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          position: 'relative',
          overflow: 'hidden',
          py: 4,
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
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Container maxWidth="sm" sx={{ position: 'relative' }}>
          <Fade in={mounted} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                bgcolor: "white",
                p: { xs: 5, md: 7 },
                borderRadius: '24px',
                boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
              }}
            >
              {/* Cancel Icon */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 4,
                  boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
                  animation: 'shake 0.5s ease-in-out',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
                  },
                }}
              >
                <CancelIcon sx={{ fontSize: 56, color: 'white' }} />
              </Box>

              <Typography 
                variant="h3" 
                fontWeight={800}
                color="#0F172A"
                sx={{ 
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  mb: 2,
                }}
              >
                Payment Cancelled
              </Typography>

              <Typography 
                variant="body1" 
                color="#64748B"
                sx={{ 
                  mb: 4,
                  maxWidth: 400,
                  mx: 'auto',
                  lineHeight: 1.8,
                }}
              >
                Looks like you cancelled the payment. Don&#39;t worry - your cart is still saved 
                and you can complete your purchase anytime.
              </Typography>

              {/* Info Cards */}
              <Stack spacing={2} sx={{ mb: 5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#FEF2F2',
                  }}
                >
                  <Refresh sx={{ color: '#EF4444' }} />
                  <Typography variant="body2" color="#991B1B" fontWeight={500}>
                    No charges have been made to your account
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#FFF7ED',
                  }}
                >
                  <Support sx={{ color: '#F97316' }} />
                  <Typography variant="body2" color="#9A3412" fontWeight={500}>
                    Need help? Contact our support team
                  </Typography>
                </Box>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button 
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  startIcon={<Refresh />}
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
                  Try Again
                </Button>
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
                  Go Back Home
                </Button>
              </Stack>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Fade>
  );
};

export default Cancel;
