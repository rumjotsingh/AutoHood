import { Link } from "react-router-dom";
import { Box, Typography, Divider, Grid, IconButton, Container, Fade, Zoom } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, DirectionsCar, Email, Phone, LocationOn } from "@mui/icons-material";
import { useState, useEffect } from 'react';
function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Fade in={mounted} timeout={800}>
      <Box
        component="footer"
        sx={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#f5f5f5",
          pt: 6,
          pb: 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f5576c 100%)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Zoom in={mounted} timeout={600}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <DirectionsCar sx={{ fontSize: 40, color: "#667eea" }} />
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      AutoHood
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                    Turning your dream car into reality. Find, compare, and purchase your perfect vehicle with confidence.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      component="a"
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#4267B2",
                        bgcolor: "rgba(66, 103, 178, 0.1)",
                        transition: "all 0.3s",
                        "&:hover": {
                          bgcolor: "#4267B2",
                          color: "white",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Facebook />
                    </IconButton>
                    <IconButton
                      component="a"
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#1DA1F2",
                        bgcolor: "rgba(29, 161, 242, 0.1)",
                        transition: "all 0.3s",
                        "&:hover": {
                          bgcolor: "#1DA1F2",
                          color: "white",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Twitter />
                    </IconButton>
                    <IconButton
                      component="a"
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#E1306C",
                        bgcolor: "rgba(225, 48, 108, 0.1)",
                        transition: "all 0.3s",
                        "&:hover": {
                          bgcolor: "#E1306C",
                          color: "white",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Instagram />
                    </IconButton>
                    <IconButton
                      component="a"
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#0077b5",
                        bgcolor: "rgba(0, 119, 181, 0.1)",
                        transition: "all 0.3s",
                        "&:hover": {
                          bgcolor: "#0077b5",
                          color: "white",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <LinkedIn />
                    </IconButton>
                  </Box>
                </Box>
              </Zoom>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Zoom in={mounted} timeout={800}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#667eea" }}>
                    Quick Links
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {[
                      { to: "/", label: "Home" },
                      { to: "/about", label: "About Us" },
                      { to: "/contact", label: "Contact" },
                      { to: "/add-car", label: "Sell Your Car" },
                    ].map((link, index) => (
                      <Link
                        key={index}
                        to={link.to}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          fontSize: "14px",
                          opacity: 0.8,
                          transition: "all 0.3s",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.opacity = "1";
                          e.target.style.color = "#667eea";
                          e.target.style.paddingLeft = "8px";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.opacity = "0.8";
                          e.target.style.color = "inherit";
                          e.target.style.paddingLeft = "0";
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Box>
                </Box>
              </Zoom>
            </Grid>

            {/* Legal */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Zoom in={mounted} timeout={1000}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#667eea" }}>
                    Legal
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {[
                      { to: "/policy", label: "Privacy Policy" },
                      { to: "/terms", label: "Terms of Service" },
                      { to: "/cookies", label: "Cookie Policy" },
                    ].map((link, index) => (
                      <Link
                        key={index}
                        to={link.to}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          fontSize: "14px",
                          opacity: 0.8,
                          transition: "all 0.3s",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.opacity = "1";
                          e.target.style.color = "#667eea";
                          e.target.style.paddingLeft = "8px";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.opacity = "0.8";
                          e.target.style.color = "inherit";
                          e.target.style.paddingLeft = "0";
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Box>
                </Box>
              </Zoom>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={3}>
              <Zoom in={mounted} timeout={1200}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#667eea" }}>
                    Contact Us
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email sx={{ fontSize: 18, color: "#667eea" }} />
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        support@autohood.com
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ fontSize: 18, color: "#667eea" }} />
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        +1 (555) 123-4567
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn sx={{ fontSize: 18, color: "#667eea" }} />
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        123 Auto Street, Car City
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: 4,
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          />

          {/* Copyright */}
          <Box textAlign="center">
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} AutoHood. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5, fontStyle: "italic" }}>
              Turning your dream car into reality ✨
            </Typography>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}

export default Footer;
