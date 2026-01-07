import { useState, useEffect } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Link, 
  Paper,
  Grid,
  Stack,
  Fade,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { 
  Home, 
  NavigateNext, 
  Security, 
  ExpandMore,
  Person,
  
  Analytics,
  Lock,
  Cookie,
  Gavel,
  Email,
  Shield,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Policy() {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState('panel1');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const sections = [
    {
      id: 'panel1',
      icon: <Person />,
      title: 'Information We Collect',
      content: [
        { subtitle: 'Personal Information', text: 'Name, email address, phone number, and other contact details you provide when registering or using our services.' },
        { subtitle: 'Vehicle Information', text: 'Details about cars you list or search for, including make, model, year, and preferences.' },
        { subtitle: 'Usage Data', text: 'Pages visited, time spent, interactions, and other analytics data to improve our services.' },
        { subtitle: 'Payment Information', text: 'Payment details processed securely through our trusted payment partners.' },
      ],
    },
    {
      id: 'panel2',
      icon: <Analytics />,
      title: 'How We Use Your Information',
      content: [
        { subtitle: 'Service Delivery', text: 'To provide, maintain, and improve our car marketplace services.' },
        { subtitle: 'Communication', text: 'To send you updates, notifications, and promotional materials (with your consent).' },
        { subtitle: 'Personalization', text: 'To customize your experience and show relevant car listings.' },
        { subtitle: 'Security', text: 'To detect, prevent, and address fraud and security issues.' },
      ],
    },
    {
      id: 'panel3',
      icon: <Lock />,
      title: 'Data Protection',
      content: [
        { subtitle: 'Encryption', text: 'All sensitive data is encrypted using industry-standard SSL/TLS protocols.' },
        { subtitle: 'Access Controls', text: 'Strict access controls limit who can view your personal information.' },
        { subtitle: 'Regular Audits', text: 'We conduct regular security audits to ensure data protection compliance.' },
        { subtitle: 'Data Retention', text: 'We retain your data only as long as necessary to provide our services.' },
      ],
    },
    {
      id: 'panel4',
      icon: <Cookie />,
      title: 'Cookies & Tracking',
      content: [
        { subtitle: 'Essential Cookies', text: 'Required for basic website functionality and security.' },
        { subtitle: 'Analytics Cookies', text: 'Help us understand how visitors interact with our website.' },
        { subtitle: 'Marketing Cookies', text: 'Used to deliver relevant advertisements (with your consent).' },
        { subtitle: 'Cookie Control', text: 'You can manage cookie preferences through your browser settings.' },
      ],
    },
    {
      id: 'panel5',
      icon: <Gavel />,
      title: 'Your Rights',
      content: [
        { subtitle: 'Access', text: 'You have the right to request a copy of your personal data.' },
        { subtitle: 'Correction', text: 'You can request corrections to inaccurate or incomplete data.' },
        { subtitle: 'Deletion', text: 'You can request deletion of your personal data (right to be forgotten).' },
        { subtitle: 'Portability', text: 'You can request your data in a machine-readable format.' },
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Breadcrumb */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', py: 2 }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<NavigateNext sx={{ fontSize: 18, color: '#94A3B8' }} />}
          >
            <RouterLink
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
            </RouterLink>
            <Typography variant="body2" color="#0F172A" fontWeight={600}>
              Privacy Policy
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          py: { xs: 6, md: 10 },
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
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center' }}>
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
              <Shield sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            
            <Typography
              variant="h2"
              fontWeight={800}
              color="white"
              sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body1"
              sx={{ 
                color: '#94A3B8',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              We value your privacy and are committed to protecting your personal information. 
              This policy outlines how we collect, use, and safeguard your data.
            </Typography>
            <Typography
              variant="caption"
              sx={{ 
                display: 'block',
                color: '#64748B',
                mt: 3,
              }}
            >
              Last updated: January 2025
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Fade in={mounted} timeout={600}>
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                {sections.map((section) => (
                  <Accordion
                    key={section.id}
                    expanded={expanded === section.id}
                    onChange={handleChange(section.id)}
                    elevation={0}
                    sx={{
                      borderRadius: '16px !important',
                      border: '1px solid',
                      borderColor: expanded === section.id ? '#F97316' : '#E2E8F0',
                      overflow: 'hidden',
                      '&:before': { display: 'none' },
                      transition: 'all 0.3s',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: '#F97316' }} />}
                      sx={{
                        p: 3,
                        '& .MuiAccordionSummary-content': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: expanded === section.id ? '#FFF7ED' : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: expanded === section.id ? '#F97316' : '#64748B',
                          transition: 'all 0.3s',
                        }}
                      >
                        {section.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600} color="#0F172A">
                        {section.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pb: 3 }}>
                      <Stack spacing={3}>
                        {section.content.map((item, index) => (
                          <Box key={index}>
                            <Typography variant="subtitle2" fontWeight={600} color="#0F172A" gutterBottom>
                              {item.subtitle}
                            </Typography>
                            <Typography variant="body2" color="#64748B" sx={{ lineHeight: 1.8 }}>
                              {item.text}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                {/* Contact Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                    Questions?
                  </Typography>
                  <Typography variant="body2" color="#64748B" sx={{ mb: 3, lineHeight: 1.8 }}>
                    If you have any questions about this Privacy Policy, please contact us.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        bgcolor: '#FFF7ED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Email sx={{ color: '#F97316' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="#64748B">Email us at</Typography>
                      <Link 
                        href="mailto:privacy@autohood.com" 
                        underline="hover"
                        sx={{ 
                          display: 'block',
                          color: '#F97316',
                          fontWeight: 600,
                        }}
                      >
                        privacy@autohood.com
                      </Link>
                    </Box>
                  </Box>
                </Paper>

                {/* Quick Links */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="white" gutterBottom>
                    Legal Documents
                  </Typography>
                  <Stack spacing={2} mt={3}>
                    {[
                      { icon: <Security sx={{ fontSize: 18 }} />, label: 'Privacy Policy', active: true },
                      { icon: <Gavel sx={{ fontSize: 18 }} />, label: 'Terms of Service' },
                      { icon: <Cookie sx={{ fontSize: 18 }} />, label: 'Cookie Policy' },
                    ].map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          color: item.active ? '#F97316' : '#94A3B8',
                          cursor: 'pointer',
                          '&:hover': { color: '#F97316' },
                          transition: 'color 0.3s',
                        }}
                      >
                        {item.icon}
                        <Typography variant="body2" fontWeight={item.active ? 600 : 400}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      </Container>
      
      <Footer />
    </Box>
  );
}

export default Policy;
