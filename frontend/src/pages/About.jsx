import { useState, useEffect } from "react";
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Button, 
  Paper,
  Chip,
  Stack,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import {
  DirectionsCar,
  VerifiedUser,
  Groups,
  TrendingUp,
  Security,
  SupportAgent,
  Handshake,
  Speed,
  ArrowForward,
  CheckCircle,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  const [, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Company Stats
  const stats = [
    { value: "10,000+", label: "Cars Sold", icon: <DirectionsCar /> },
    { value: "50,000+", label: "Happy Customers", icon: <Groups /> },
    { value: "500+", label: "Verified Dealers", icon: <VerifiedUser /> },
    { value: "98%", label: "Satisfaction Rate", icon: <TrendingUp /> },
  ];

  // Core Values
  const values = [
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: "Trust & Transparency",
      description: "We believe in complete transparency in every transaction. No hidden fees, no surprises.",
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 32 }} />,
      title: "Quality Assurance",
      description: "Every vehicle undergoes rigorous inspection to ensure it meets our high standards.",
    },
    {
      icon: <SupportAgent sx={{ fontSize: 32 }} />,
      title: "Customer First",
      description: "Your satisfaction is our priority. We're here to help at every step of your journey.",
    },
    {
      icon: <Handshake sx={{ fontSize: 32 }} />,
      title: "Integrity",
      description: "We conduct business with honesty and integrity, building lasting relationships.",
    },
  ];

  // Team Members
  const team = [
    {
      name: "Rajesh Sharma",
      role: "CEO & Founder",
      bio: "20+ years in automotive industry",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Priya Kapoor",
      role: "Chief Technology Officer",
      bio: "Former Tech Lead at major startups",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Amit Patel",
      role: "Head of Operations",
      bio: "Expert in automotive logistics",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      linkedin: "#",
      twitter: "#",
    },
  ];

  // Trust Badges
  const badges = [
    "ISO 9001 Certified",
    "SSL Secured",
    "Verified Dealers",
    "Money-Back Guarantee",
    "24/7 Support",
    "Data Protected",
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" maxWidth={800} mx="auto">
            <Chip 
              label="About AutoHood" 
              sx={{ 
                bgcolor: 'rgba(249, 115, 22, 0.2)', 
                color: '#FB923C',
                fontWeight: 600,
                mb: 3,
                fontSize: '0.85rem',
              }} 
            />
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              Transforming the Way
              <Box 
                component="span" 
                sx={{ 
                  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block',
                }}
              >
                India Buys Cars
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#94A3B8',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Founded with a vision to simplify car buying and selling, AutoHood has become 
              India&#39;s most trusted automotive marketplace, connecting thousands of buyers 
              and sellers every day.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 4, bgcolor: 'white', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '16px',
                      bgcolor: '#FFF7ED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F97316',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight={800} color="#0F172A">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="#64748B">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Story Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=500&fit=crop"
                  alt="AutoHood Team"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '24px',
                  }}
                />
                {/* Floating Card */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    bottom: 24,
                    left: 24,
                    right: 24,
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Speed sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="#0F172A">
                        Since 2018
                      </Typography>
                      <Typography variant="body2" color="#64748B">
                        Serving customers across India
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Chip 
                label="Our Story" 
                sx={{ 
                  bgcolor: '#FFF7ED', 
                  color: '#F97316',
                  fontWeight: 600,
                  mb: 2,
                }} 
              />
              <Typography 
                variant="h3" 
                fontWeight={800} 
                color="#0F172A" 
                gutterBottom
                sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
              >
                Building Trust in Every Transaction
              </Typography>
              <Typography variant="body1" color="#64748B" paragraph sx={{ lineHeight: 1.8 }}>
                AutoHood was born from a simple observation: buying or selling a car 
                shouldn&#39;t be stressful. We set out to create a platform that brings 
                transparency, trust, and technology together to transform the automotive 
                marketplace.
              </Typography>
              <Typography variant="body1" color="#64748B" paragraph sx={{ lineHeight: 1.8 }}>
                Today, we&#39;re proud to be India&#39;s fastest-growing automotive platform, 
                helping thousands of families find their perfect vehicle every month. 
                Our commitment to quality, transparency, and customer satisfaction 
                remains at the heart of everything we do.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/contact')}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                  },
                }}
              >
                Get in Touch
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: 'white',
                }}
              >
                <Chip 
                  label="Our Mission" 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(249, 115, 22, 0.2)', 
                    color: '#FB923C',
                    fontWeight: 600,
                    mb: 3,
                  }} 
                />
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Simplifying Car Ownership
                </Typography>
                <Typography variant="body1" sx={{ color: '#94A3B8', lineHeight: 1.8 }}>
                  To empower every Indian with the knowledge, tools, and confidence 
                  to make informed decisions about buying, selling, and owning vehicles. 
                  We strive to make the entire automotive journey seamless, transparent, 
                  and enjoyable.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: '20px',
                  border: '2px solid #F97316',
                  bgcolor: '#FFF7ED',
                }}
              >
                <Chip 
                  label="Our Vision" 
                  size="small"
                  sx={{ 
                    bgcolor: '#F97316', 
                    color: 'white',
                    fontWeight: 600,
                    mb: 3,
                  }} 
                />
                <Typography variant="h4" fontWeight={700} color="#0F172A" gutterBottom>
                  India&#39;s #1 Auto Platform
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', lineHeight: 1.8 }}>
                  To become India&#39;s most trusted automotive ecosystem, integrating 
                  car discovery, financing, insurance, and after-sales services into 
                  one seamless experience. We envision a future where every car 
                  transaction is backed by trust and technology.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip 
              label="What We Stand For" 
              sx={{ 
                bgcolor: '#FFF7ED', 
                color: '#F97316',
                fontWeight: 600,
                mb: 2,
              }} 
            />
            <Typography 
              variant="h3" 
              fontWeight={800} 
              color="#0F172A"
              sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
            >
              Our Core Values
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    bgcolor: 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#F97316',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 30px rgba(249, 115, 22, 0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '18px',
                      bgcolor: '#FFF7ED',
                      color: '#F97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    {value.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="#64748B" lineHeight={1.7}>
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip 
              label="Leadership" 
              sx={{ 
                bgcolor: '#FFF7ED', 
                color: '#F97316',
                fontWeight: 600,
                mb: 2,
              }} 
            />
            <Typography 
              variant="h3" 
              fontWeight={800} 
              color="#0F172A"
              sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
            >
              Meet Our Team
            </Typography>
            <Typography variant="body1" color="#64748B" maxWidth={500} mx="auto" mt={2}>
              Passionate individuals dedicated to revolutionizing the automotive industry
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 30px rgba(15, 23, 42, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: '100%',
                        height: 280,
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h6" fontWeight={700} color="#0F172A">
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#F97316', 
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="#64748B" mb={2}>
                      {member.bio}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Avatar
                        component="a"
                        href={member.linkedin}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#F1F5F9',
                          color: '#0A66C2',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: '#0A66C2',
                            color: 'white',
                          },
                        }}
                      >
                        <LinkedIn sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Avatar
                        component="a"
                        href={member.twitter}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#F1F5F9',
                          color: '#1DA1F2',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: '#1DA1F2',
                            color: 'white',
                          },
                        }}
                      >
                        <Twitter sx={{ fontSize: 18 }} />
                      </Avatar>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Trust Badges */}
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={4}>
            <Typography variant="body2" color="#64748B" fontWeight={600}>
              TRUSTED & CERTIFIED
            </Typography>
          </Box>
          <Stack 
            direction="row" 
            flexWrap="wrap" 
            justifyContent="center" 
            gap={2}
          >
            {badges.map((badge, index) => (
              <Chip
                key={index}
                icon={<CheckCircle sx={{ fontSize: 16 }} />}
                label={badge}
                sx={{
                  bgcolor: 'white',
                  border: '1px solid #E2E8F0',
                  fontWeight: 500,
                  py: 2.5,
                  px: 1,
                  '& .MuiChip-icon': {
                    color: '#10B981',
                  },
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            fontWeight={800} 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Join the AutoHood Family
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9, 
              mb: 4, 
              maxWidth: 500, 
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Whether you&#39;re buying or selling, we&#39;re here to make your journey seamless.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: 'white',
                color: '#F97316',
                fontWeight: 700,
                fontSize: '1rem',
                px: 4,
                py: 1.75,
                borderRadius: '14px',
                textTransform: 'none',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              Start Browsing Cars
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 2,
                fontWeight: 600,
                px: 4,
                py: 1.75,
                borderRadius: '14px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  borderWidth: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
