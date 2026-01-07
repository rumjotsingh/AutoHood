import { Container, Box, Typography, Link, Divider } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function Policy() {
  return (
    <div>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            CarDekho Privacy Policy
          </Typography>
          <Divider />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Introduction
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Welcome to DreamCar This privacy policy outlines how we handle your
            personal information and protect your data.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Information We Collect
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <strong>Personal Information:</strong> Name, email, phone number, etc.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Vehicle Information:</strong> Model, make, and preferences.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Usage Data:</strong> Pages visited, time spent, and interactions.
              </Typography>
            </li>
          </ul>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Your Rights
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You have the right to access, modify, or delete your personal data.
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1">
            For any concerns or questions, reach out to us at{" "}
            <Link href="mailto:support@cardekho.com" underline="hover">
              support@cardekho.com
            </Link>
            .
          </Typography>
        </Box>
        <Divider sx={{ my: 4 }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 CarDekho. All rights reserved.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
export default Policy;
