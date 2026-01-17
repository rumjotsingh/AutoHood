import { useState, useEffect } from "react";
import { Container, Box, Typography, Breadcrumbs, Fade } from "@mui/material";
import { Home, NavigateNext, Cookie } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cookies() {
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
            <Typography variant="body2" color="#0F172A" fontWeight={600}>Cookie Policy</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Box sx={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ textAlign: "center", color: "white" }}>
          <Box sx={{ width: 72, height: 72, borderRadius: "20px", background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <Cookie sx={{ fontSize: 36, color: "white" }} />
          </Box>
          <Typography variant="h3" fontWeight={800}>Cookie Policy</Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8", maxWidth: 700, mx: "auto", mt: 2 }}>
            We use cookies to improve site functionality, analytics, and advertising. This page explains how we use cookies.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Fade in={mounted} timeout={600}>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>What are cookies?</Typography>
            <Typography paragraph>
              Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.
            </Typography>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Types of cookies we use</Typography>
            <Typography paragraph>
              Essential cookies for site functionality, analytics cookies to understand usage, and optional marketing cookies for personalized ads.
            </Typography>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Managing cookies</Typography>
            <Typography paragraph>
              You can manage or disable cookies through your browser settings. Note that disabling cookies may affect site functionality.
            </Typography>
          </Box>
        </Fade>
      </Container>

      <Footer />
    </Box>
  );
}

export default Cookies;
