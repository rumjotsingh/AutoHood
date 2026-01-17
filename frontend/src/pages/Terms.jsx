import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Fade,
} from "@mui/material";
import { Home, NavigateNext, Gavel } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Terms() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #E2E8F0", py: 2 }}>
        <Container maxWidth="lg">
          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 18, color: "#94A3B8" }} />}>
            <RouterLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <Home sx={{ fontSize: 18, color: "#64748B" }} />
              <Typography variant="body2" color="#64748B">Home</Typography>
            </RouterLink>
            <Typography variant="body2" color="#0F172A" fontWeight={600}>Terms of Use</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Box sx={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ textAlign: "center", color: "white" }}>
          <Box sx={{ width: 72, height: 72, borderRadius: "20px", background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <Gavel sx={{ fontSize: 36, color: "white" }} />
          </Box>
          <Typography sx={{ color: "white" }} variant="h3" fontWeight={800}>Terms of Use</Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8", maxWidth: 700, mx: "auto", mt: 2 }}>
            These terms govern your access to and use of AutoHood. By using our services you agree to these terms.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Fade in={mounted} timeout={600}>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>1. Acceptance</Typography>
            <Typography paragraph>
              By accessing or using AutoHood, you agree to be bound by these Terms of Use and all applicable laws and regulations.
            </Typography>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>2. User Obligations</Typography>
            <Typography paragraph>
              Users must provide accurate information, comply with all applicable laws, and refrain from posting prohibited content.
            </Typography>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>3. Listings</Typography>
            <Typography paragraph>
              Sellers are responsible for the accuracy of their listings. AutoHood does not guarantee transactions between users.
            </Typography>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>4. Limitation of Liability</Typography>
            <Typography paragraph>
              AutoHood is provided as-is. To the fullest extent permitted by law, we are not liable for indirect or consequential damages.
            </Typography>
          </Box>
        </Fade>
      </Container>

      <Footer />
    </Box>
  );
}

export default Terms;
