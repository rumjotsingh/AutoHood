import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  TextField, 
  MenuItem, 
  Typography, 
  Box,
  Container,
  Fade,
  Paper,
  Grid,
  Slider,
  InputAdornment,
  Breadcrumbs,
  Stack,
  Divider,
} from "@mui/material";
import { 
  Calculate, 
  Home, 
  NavigateNext,
  AccountBalance,
  CalendarMonth,
  Percent,
  TrendingUp,
  Info,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from '../config/api';

const CarLoanCalculator = () => {
  const { id } = useParams(); 
  const [carPrice, setCarPrice] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [years, setYears] = useState(3);
  const [interestRate, setInterestRate] = useState(8);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCarPrice = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CARS.DETAILS.replace(':id', id));
        const carData = await response.json();
        const onRoadPrice = carData.price + carData.price * 0.1 + carData.price * 0.01;
        setCarPrice(onRoadPrice);
        setLoanAmount(onRoadPrice / 2);
      } catch (error) {
        console.error("Error fetching car price:", error);
      }
    };

    fetchCarPrice();
  }, [id]);

  const handleLoanChange = (e) => {
    let value = e.target.value.replace(/[^0-9,]/g, "");
    value = value.replace(/,/g, "");
    let numericValue = value ? parseInt(value, 10) : 0;
    numericValue = Math.min(Math.max(numericValue, 0), carPrice);
    setLoanAmount(numericValue);
  };

  const handleSliderChange = (event, newValue) => {
    setLoanAmount(newValue);
  };

  const handleInterestChange = (e) => {
    let value = parseFloat(e.target.value);
    setInterestRate(value < 0 ? 0 : value);
  };

  const calculateEMI = () => {
    let monthlyRate = interestRate / 100 / 12;
    let months = years * 12;
    let emi = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(emi);
  };

  const totalPayment = () => {
    let monthlyRate = interestRate / 100 / 12;
    let months = years * 12;
    let emi = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return emi * months;
  };

  const totalInterest = () => {
    return totalPayment() - loanAmount;
  };

  const inputStyles = {
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
    "& .MuiInputLabel-root.Mui-focused": {
      color: '#F97316',
    },
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Breadcrumb */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', py: 2 }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<NavigateNext sx={{ fontSize: 18, color: '#94A3B8' }} />}
          >
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Home sx={{ fontSize: 18, color: '#64748B' }} />
              <Typography variant="body2" color="#64748B">Home</Typography>
            </Link>
            <Link 
              to={`/cars/${id}`} 
              style={{ textDecoration: 'none' }}
            >
              <Typography variant="body2" color="#64748B">Car Details</Typography>
            </Link>
            <Typography variant="body2" color="#0F172A" fontWeight={600}>
              Loan Calculator
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Fade in={mounted} timeout={600}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 12px 40px rgba(249, 115, 22, 0.3)',
                }}
              >
                <Calculate sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography
                variant="h3"
                fontWeight={800}
                color="#0F172A"
                sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
              >
                Car Loan Calculator
              </Typography>
              <Typography variant="body1" color="#64748B" sx={{ mt: 1 }}>
                Calculate your monthly EMI and plan your budget
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Left - Input Form */}
              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  {/* On-Road Price Display */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      bgcolor: '#F1F5F9',
                      mb: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TrendingUp sx={{ color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="#64748B">
                          On-Road Price
                        </Typography>
                        <Typography variant="h5" fontWeight={800} color="#0F172A">
                          ₹{new Intl.NumberFormat("en-IN").format(carPrice)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Stack spacing={4}>
                    {/* Loan Amount */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AccountBalance sx={{ color: '#F97316', fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="#0F172A">
                          Loan Amount
                        </Typography>
                      </Box>
                      <TextField
                        type="text"
                        value={loanAmount ? new Intl.NumberFormat("en-IN").format(loanAmount) : ""}
                        onChange={handleLoanChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography fontWeight={600} color="#64748B">₹</Typography>
                            </InputAdornment>
                          ),
                        }}
                        sx={inputStyles}
                      />
                      <Slider
                        value={loanAmount}
                        onChange={handleSliderChange}
                        min={0}
                        max={carPrice}
                        step={10000}
                        sx={{
                          mt: 2,
                          color: '#F97316',
                          '& .MuiSlider-thumb': {
                            bgcolor: 'white',
                            border: '2px solid #F97316',
                            '&:hover': {
                              boxShadow: '0 0 0 8px rgba(249, 115, 22, 0.16)',
                            },
                          },
                          '& .MuiSlider-track': {
                            bgcolor: '#F97316',
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="#94A3B8">₹0</Typography>
                        <Typography variant="caption" color="#94A3B8">
                          ₹{new Intl.NumberFormat("en-IN").format(carPrice)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Loan Term */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CalendarMonth sx={{ color: '#F97316', fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="#0F172A">
                          Loan Term
                        </Typography>
                      </Box>
                      <TextField
                        select
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value))}
                        fullWidth
                        sx={inputStyles}
                      >
                        {[...Array(10)].map((_, i) => (
                          <MenuItem key={i} value={i + 1}>
                            {i + 1} {i === 0 ? 'Year' : 'Years'}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    {/* Interest Rate */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Percent sx={{ color: '#F97316', fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="#0F172A">
                          Interest Rate
                        </Typography>
                      </Box>
                      <TextField
                        type="number"
                        value={interestRate}
                        onChange={handleInterestChange}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography fontWeight={600} color="#64748B">%</Typography>
                            </InputAdornment>
                          ),
                        }}
                        sx={inputStyles}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Right - Results */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    position: 'sticky',
                    top: 100,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="white" gutterBottom>
                    Your EMI Breakdown
                  </Typography>
                  
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 5,
                      px: 3,
                      borderRadius: '16px',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      mt: 3,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Monthly EMI
                    </Typography>
                    <Typography 
                      variant="h3" 
                      fontWeight={800} 
                      sx={{ 
                        color: '#F97316',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      {calculateEMI()}
                    </Typography>
                    <Typography variant="caption" color="#94A3B8">per month</Typography>
                  </Box>

                  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="#94A3B8">Principal Amount</Typography>
                      <Typography variant="subtitle2" fontWeight={600} color="white">
                        ₹{new Intl.NumberFormat("en-IN").format(loanAmount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="#94A3B8">Total Interest</Typography>
                      <Typography variant="subtitle2" fontWeight={600} color="#F97316">
                        ₹{new Intl.NumberFormat("en-IN").format(Math.round(totalInterest()))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="#94A3B8">Total Payment</Typography>
                      <Typography variant="subtitle2" fontWeight={600} color="white">
                        ₹{new Intl.NumberFormat("en-IN").format(Math.round(totalPayment()))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="#94A3B8">Loan Duration</Typography>
                      <Typography variant="subtitle2" fontWeight={600} color="white">
                        {years} {years === 1 ? 'Year' : 'Years'} ({years * 12} months)
                      </Typography>
                    </Box>
                  </Stack>

                  <Box 
                    sx={{ 
                      mt: 4, 
                      p: 2, 
                      borderRadius: '12px', 
                      bgcolor: 'rgba(249, 115, 22, 0.15)',
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Info sx={{ color: '#F97316', fontSize: 20, mt: 0.25 }} />
                    <Typography variant="caption" color="#94A3B8" sx={{ lineHeight: 1.6 }}>
                      This is an estimated calculation. Actual EMI may vary based on the bank&#39;s terms and processing fees.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default CarLoanCalculator;
