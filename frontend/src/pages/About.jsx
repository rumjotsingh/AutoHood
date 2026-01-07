import { Container, Grid, Box, Typography, Button, Paper } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <Box>
      <Navbar />
      <Container>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 4, md: 6 }, // Adjust padding for mobile (xs) and desktop (md)
            backgroundColor: "#f4f4f4",
            borderRadius: 2,
            boxShadow: 2,
            mt: 4,
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
            Welcome to DreamCar
          </Typography>
          <Typography variant="h6" component="p" paragraph sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}>
            Simplifying Cars, Amplifying Trust.
          </Typography>
          <Button variant="contained" color="primary">
            Discover More
          </Button>
        </Box>

        {/* Stats Section */}
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, mt: 6 }}>
          {[
            { value: "100%", label: "Customer Satisfaction" },
            { value: "24/7", label: "Support Services" },
            { value: "1M+", label: "Cars Delivered" },
          ].map((stat, index) => (
            <Paper key={index} sx={{ p: 4, textAlign: "center", flex: "1 1 300px" }}>
              <Typography variant="h4">{stat.value}</Typography>
              <Typography variant="h6">{stat.label}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Mission & Vision */}
        <Grid container spacing={4} sx={{ mt: 6, mb: 6 }}>
          {[
            { title: "Our Mission", text: "Enable customers to make informed and confident decisions regarding car buying, selling, and ownership." },
            { title: "Our Vision", text: "Aspire to become the most trusted automotive platform by integrating car reviews, comparisons, financing, insurance, and after-sales services." },
          ].map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5">{item.title}</Typography>
                <Typography>{item.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Team Section */}
        <Box sx={{ textAlign: "center", mt: 6, mb: 6 }}>
          <Typography variant="h4">Meet the Panthers</Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              { name: "Alex Panther", role: "CEO & Founder", image: "https://media.istockphoto.com/id/1413766112/photo/successful-mature-businessman-looking-at-camera-with-confidence.jpg?s=612x612&w=0&k=20&c=NJSugBzNuZqb7DJ8ZgLfYKb3qPr2EJMvKZ21Sj5Sfq4=" },
              { name: "Jane Swift", role: "Chief Technology Officer", image: "https://media.istockphoto.com/id/891418990/photo/confident-businessman-posing-in-the-office.jpg?s=612x612&w=0&k=20&c=a3PcRJAN9QTIfOUJj566B_I4xx2LANZFnX90_-Oe7CI=" },
              { name: "Sam Claw", role: "Creative Lead", image: "https://media.istockphoto.com/id/1210318875/photo/portrait-of-mature-businessman-at-modern-office.jpg?s=612x612&w=0&k=20&c=iT6I5-1WIzRwQ4ioaUQ9ErOm7siE9nD0pbVC6kq0M_g=" },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ width: "100%", height: "auto", borderRadius: "50%" }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="body1">{member.role}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
