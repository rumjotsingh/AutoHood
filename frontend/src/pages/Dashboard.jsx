import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  DirectionsCar,
  Visibility,
  Favorite,
  Email,
  TrendingUp,
  ArrowForward,
  Add,
  Person,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../redux/slices/analyticsSlice";
import { fetchFavorites } from "../redux/slices/favoritesSlice";
import { fetchReceivedInquiries } from "../redux/slices/inquiriesSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StatCard = ({ icon, title, value, trend, color, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      "&:hover": onClick
        ? {
            transform: "translateY(-4px)",
            boxShadow: 4,
          }
        : {},
    }}
  >
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} color={color || "text.primary"}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <TrendingUp sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
              <Typography variant="caption" color="success.main">
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: `${color || "primary.main"}15`,
            color: color || "primary.main",
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

StatCard.defaultProps = {
  trend: null,
  color: null,
  onClick: null,
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { dashboard, dashboardLoading, error } = useSelector((state) => state.analytics);
  const { favorites } = useSelector((state) => state.favorites);
  const { receivedInquiries, unreadCount } = useSelector((state) => state.inquiries);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDashboard());
      dispatch(fetchFavorites());
      dispatch(fetchReceivedInquiries());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Sign in to access your dashboard
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Manage your listings, view analytics, and track your activity.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
            >
              Sign In
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  if (dashboardLoading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" height={140} />
              </Grid>
            ))}
            <Grid item xs={12} md={8}>
              <Skeleton variant="rounded" height={400} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rounded" height={400} />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#0F172A">
                Welcome back, {user?.name?.split(" ")[0] || "User"}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here&apos;s what&apos;s happening with your listings
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/add-car")}
                sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
              >
                New Listing
              </Button>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<DirectionsCar />}
              title="Total Listings"
              value={dashboard?.stats?.totalListings || 0}
              color="#0F172A"
              onClick={() => navigate("/my-listings")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Visibility />}
              title="Total Views"
              value={dashboard?.stats?.totalViews || 0}
              trend="+12% this week"
              color="#3B82F6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Favorite />}
              title="Total Favorites"
              value={dashboard?.stats?.totalFavorites || 0}
              color="#EF4444"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Email />}
              title="Pending Inquiries"
              value={unreadCount || dashboard?.stats?.pendingInquiries || 0}
              color="#F97316"
              onClick={() => navigate("/inquiries")}
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Popular Listings */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Popular Listings
                </Typography>
                <Button
                  endIcon={<ArrowForward />}
                  size="small"
                  onClick={() => navigate("/my-listings")}
                >
                  View All
                </Button>
              </Box>

              {dashboard?.popularListings?.length > 0 ? (
                <List disablePadding>
                  {dashboard.popularListings.map((listing, index) => (
                    <React.Fragment key={listing._id}>
                      <ListItem
                        sx={{
                          px: 0,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "action.hover" },
                          borderRadius: 2,
                        }}
                        onClick={() => navigate(`/cars/${listing._id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={listing.image?.url || listing.image}
                            variant="rounded"
                            sx={{ width: 56, height: 56, mr: 1 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography fontWeight={600}>{listing.carName}</Typography>
                          }
                          secondary={
                            <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                ${listing.price?.toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {listing.views || 0} views
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              bgcolor: index === 0 ? "#F97316" : "#E2E8F0",
                              color: index === 0 ? "white" : "text.primary",
                              fontWeight: 600,
                            }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < dashboard.popularListings.length - 1 && (
                        <Divider sx={{ my: 1 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <DirectionsCar sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography color="text.secondary">No listings yet</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/car-listing")}
                    sx={{ mt: 2, bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
                  >
                    Create Your First Listing
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Recent Inquiries */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Inquiries
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} new`}
                    size="small"
                    color="error"
                  />
                )}
              </Box>

              {receivedInquiries?.length > 0 ? (
                <List disablePadding>
                  {receivedInquiries.slice(0, 5).map((inquiry, index) => (
                    <React.Fragment key={inquiry._id}>
                      <ListItem
                        sx={{
                          px: 0,
                          alignItems: "flex-start",
                          opacity: inquiry.status === "read" ? 0.7 : 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: inquiry.status === "pending" ? "#F97316" : "#E2E8F0" }}>
                            {inquiry.sender?.name?.[0] || "U"}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={inquiry.status === "pending" ? 600 : 400}>
                              {inquiry.sender?.name || "Unknown User"}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {inquiry.message}
                              </Typography>
                              <Typography variant="caption" color="text.disabled" display="block">
                                {new Date(inquiry.createdAt).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < Math.min(receivedInquiries.length, 5) - 1 && (
                        <Divider sx={{ my: 1 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Email sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography color="text.secondary">No inquiries yet</Typography>
                </Box>
              )}

              {receivedInquiries?.length > 5 && (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/inquiries")}
                >
                  View All Inquiries
                </Button>
              )}
            </Paper>
          </Grid>

          {/* Saved Cars */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Saved Cars
                </Typography>
                <Button
                  endIcon={<ArrowForward />}
                  size="small"
                  onClick={() => navigate("/favorites")}
                >
                  View All
                </Button>
              </Box>

              {favorites?.length > 0 ? (
                <Grid container spacing={2}>
                  {favorites.slice(0, 4).map((fav) => {
                    const car = fav.car || fav;
                    return (
                      <Grid item xs={12} sm={6} md={3} key={fav._id}>
                        <Card
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                          }}
                          onClick={() => navigate(`/cars/${car._id}`)}
                        >
                          <Box
                            component="img"
                            src={car.image?.url || car.image}
                            alt={car.carName}
                            sx={{
                              width: "100%",
                              height: 140,
                              objectFit: "cover",
                            }}
                          />
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap>
                              {car.carName}
                            </Typography>
                            <Typography variant="body2" color="#F97316" fontWeight={600}>
                              ₹{car.price?.toLocaleString('en-IN')}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Favorite sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography color="text.secondary">No saved cars yet</Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/search")}
                    sx={{ mt: 2, bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
                  >
                    Browse Cars
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
    <Footer />
    </>
  );
};

export default Dashboard;
