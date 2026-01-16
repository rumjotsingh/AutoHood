import { Link } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton, 
  Container, 
  Stack,
  Button,

} from "@mui/material";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  YouTube,
  DirectionsCar, 
  Email, 
  Phone, 
  LocationOn,

  Apple,
  Android,
  
} from "@mui/icons-material";

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/add-car", label: "Sell Your Car" },
  ];

  const legalLinks = [
    { to: "/policy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/cookies", label: "Cookie Policy" },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: "https://facebook.com", label: "Facebook", color: "#1877F2" },
    { icon: <Twitter />, href: "https://twitter.com", label: "Twitter", color: "#1DA1F2" },
    { icon: <Instagram />, href: "https://instagram.com", label: "Instagram", color: "#E4405F" },
    { icon: <LinkedIn />, href: "https://linkedin.com", label: "LinkedIn", color: "#0A66C2" },
    { icon: <YouTube />, href: "https://youtube.com", label: "YouTube", color: "#FF0000" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #0F172A 0%, #020617 100%)',
        color: 'white',
        pt: { xs: 6, md: 8 },
        pb: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #F97316 0%, #FB923C 50%, #F97316 100%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        {/* Newsletter Section */}
        {/* <Box
          sx={{
            p: { xs: 3, md: 4 },
            mb: 6,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(251, 146, 60, 0.1) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              Stay Updated with AutoHood
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Get the latest car listings, deals, and automotive news delivered to your inbox.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
            <TextField
              placeholder="Enter your email"
              size="small"
              sx={{
                flex: 1,
                minWidth: { md: 280 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(249, 115, 22, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#F97316',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#64748B',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#64748B', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{
                px: 3,
                background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                borderRadius: '12px',
                minWidth: 'auto',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                  boxShadow: '0 6px 20px rgba(249, 115, 22, 0.5)',
                },
              }}
            >
              <Send sx={{ fontSize: 20 }} />
            </Button>
          </Box>
        </Box> */}

        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
                  }}
                >
                  <DirectionsCar sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography  sx={{ color: 'white', fontSize: 28 }} variant="h5" fontWeight={800} letterSpacing="-0.02em">
                  AutoHood
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#94A3B8', 
                  lineHeight: 1.8,
                  maxWidth: 300,
                  mb: 3,
                }}
              >
                Your trusted automotive marketplace. Find, compare, and purchase your perfect 
                vehicle with confidence. Modern car buying made simple.
              </Typography>

              {/* Social Links */}
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: '#64748B',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      width: 40,
                      height: 40,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: social.color,
                        color: 'white',
                        transform: 'translateY(-3px)',
                        boxShadow: `0 4px 14px ${social.color}40`,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography 
              variant="subtitle1" 
              fontWeight={700} 
              gutterBottom
              sx={{ 
                color: '#F97316',
                mb: 2,
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94A3B8',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        color: 'white',
                        pl: 1,
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography 
              variant="subtitle1" 
              fontWeight={700} 
              gutterBottom
              sx={{ 
                color: '#F97316',
                mb: 2,
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Legal
            </Typography>
            <Stack spacing={1.5}>
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94A3B8',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'white',
                        pl: 1,
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography 
              variant="subtitle1" 
              fontWeight={700} 
              gutterBottom
              sx={{ 
                color: '#F97316',
                mb: 2,
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Email sx={{ color: '#F97316', fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E2E8F0' }}>
                    support@autohood.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone sx={{ color: '#F97316', fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E2E8F0' }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <LocationOn sx={{ color: '#F97316', fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    Address
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E2E8F0' }}>
                    123 Auto Street, Car City, CC 12345
                  </Typography>
                </Box>
              </Box>
            </Stack>

            {/* App Download Buttons */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 1.5, fontSize: '0.75rem' }}>
                Download our mobile app
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Apple sx={{ fontSize: 18 }} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    py: 1,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  App Store
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Android sx={{ fontSize: 18 }} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    py: 1,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  Play Store
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#64748B', textAlign: { xs: 'center', sm: 'left' } }}>
            © {currentYear} AutoHood. All rights reserved.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            Made with ❤️ for car enthusiasts
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
