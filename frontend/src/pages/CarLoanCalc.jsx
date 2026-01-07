import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  TextField, 
  MenuItem, 
  CardContent, 
  Typography, 
  Box,
  Container,
  Fade,
  Paper,
} from "@mui/material";
import { Calculate } from "@mui/icons-material";
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

        setCarPrice(carData.price + carData.price * 0.1 + carData.price * 0.01);
        setLoanAmount((carData.price + carData.price * 0.1 + carData.price * 0.01) / 2);
      } catch (error) {
        console.error("Error fetching car price:", error);
      }
    };

    fetchCarPrice();
  }, [id]);

  const handleLoanChange = (e) => {
    let value = e.target.value.replace(/[^0-9,]/g, ""); // Allow only numbers & commas
    value = value.replace(/,/g, ""); // Remove commas for proper number handling

    let numericValue = value ? parseInt(value, 10) : 0;
    numericValue = Math.min(Math.max(numericValue, 0), carPrice); // Ensure within range

    setLoanAmount(numericValue);
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
      minimumFractionDigits: 2,
    }).format(emi);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <Fade in={mounted} timeout={800}>
            <Box>
              {/* Header */}
              <Box textAlign="center" mb={4}>
                <Calculate sx={{ fontSize: { xs: 50, md: 60 }, color: "white", mb: 2 }} />
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  color="white"
                  sx={{ 
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Car Loan Calculator
                </Typography>
              </Box>

              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 3, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    On Road Car Price: ₹{new Intl.NumberFormat("en-IN").format(carPrice)}
                  </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              padding: 2,
              borderRadius: "8px",
              boxShadow: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* Loan Amount Input */}
            <TextField
              label="Loan Amount (in Rupees)"
              type="text"
              value={loanAmount ? new Intl.NumberFormat("en-IN").format(loanAmount) : ""}
              onChange={handleLoanChange}
              fullWidth
            />

            {/* Loan Term Dropdown */}
            <TextField
              select
              label="Loan Term (Years)"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              fullWidth
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i} value={i + 1}>
                  {i + 1} Years
                </MenuItem>
              ))}
            </TextField>

            {/* Interest Rate Input */}
            <TextField
              label="Interest Rate (%)"
              type="number"
              value={interestRate}
              onChange={handleInterestChange}
              fullWidth
            />
          </Box>

                  {/* EMI Result */}
                  <Box
                    sx={{
                      textAlign: "center",
                      marginTop: 4,
                      padding: 3,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
                      Estimated EMI:
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "white", mt: 1, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                      {calculateEMI()} per month
                    </Typography>
                  </Box>
                </CardContent>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CarLoanCalculator;
