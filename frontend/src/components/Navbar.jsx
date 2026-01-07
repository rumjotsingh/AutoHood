import { useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Container,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  DirectionsCar,
  Logout,
  Login,
  PersonAdd,
  AddCircle,
  Home,
  Info,
  ContactMail,
  Dashboard,
  Favorite,
  Email,
} from "@mui/icons-material";
import Search from "../pages/Search";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout as logoutAction } from '../redux/slices/authSlice';
import { fetchUnreadCount } from '../redux/slices/inquiriesSlice';
import { fetchFavorites } from '../redux/slices/favoritesSlice';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.inquiries);
  const { favoriteIds } = useAppSelector((state) => state.favorites);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch unread count and favorites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate("/login", { replace: true });
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Home /> },
    { to: "/about", label: "About", icon: <Info /> },
    { to: "/contact", label: "Contact", icon: <ContactMail /> },
  ];

  // Additional links for authenticated users
  const authLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <Dashboard /> },
    { to: "/my-listings", label: "My Listings", icon: <DirectionsCar /> },
    { 
      to: "/favorites", 
      label: "Favorites", 
      icon: <Favorite />,
      badge: favoriteIds.length 
    },
    { 
      to: "/inquiries", 
      label: "Messages", 
      icon: <Email />,
      badge: unreadCount 
    },
  ];

  // Mobile Drawer Content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DirectionsCar sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
            AutoHood
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Info (if logged in) */}
      {isAuthenticated && (
        <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#0F172A',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="#0F172A">
                {user?.name || "User"}
              </Typography>
              <Typography variant="body2" color="#64748B">
                {user?.email || "Welcome back!"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation Links */}
      <List sx={{ flex: 1, py: 2 }}>
        {navLinks.map((link) => (
          <ListItem key={link.to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={link.to}
              onClick={handleDrawerToggle}
              sx={{
                py: 1.5,
                px: 3,
                '&:hover': {
                  bgcolor: '#F1F5F9',
                },
                '&.active': {
                  bgcolor: '#FFF7ED',
                  borderRight: '3px solid #F97316',
                  '& .MuiListItemIcon-root': {
                    color: '#F97316',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#F97316',
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#64748B' }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText 
                primary={link.label} 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        {/* Auth-only links */}
        {isAuthenticated && (
          <>
            {authLinks.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={link.to}
                  onClick={handleDrawerToggle}
                  sx={{
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      bgcolor: '#F1F5F9',
                    },
                    '&.active': {
                      bgcolor: '#FFF7ED',
                      borderRight: '3px solid #F97316',
                      '& .MuiListItemIcon-root': {
                        color: '#F97316',
                      },
                      '& .MuiListItemText-primary': {
                        color: '#F97316',
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: '#64748B' }}>
                    {link.badge > 0 ? (
                      <Badge badgeContent={link.badge} color="error">
                        {link.icon}
                      </Badge>
                    ) : (
                      link.icon
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={link.label} 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {!isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/login"
                onClick={handleDrawerToggle}
                sx={{ py: 1.5, px: 3 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Login />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/register"
                onClick={handleDrawerToggle}
                sx={{ py: 1.5, px: 3 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{ 
                py: 1.5, 
                px: 3,
                color: '#EF4444',
                '&:hover': {
                  bgcolor: '#FEF2F2',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#EF4444' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      {/* Add Car CTA */}
      <Box sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
        <Button
          component={NavLink}
          to="/add-car"
          onClick={handleDrawerToggle}
          fullWidth
          variant="contained"
          startIcon={<AddCircle />}
          sx={{
            py: 1.5,
            background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
            color: 'white',
            fontWeight: 600,
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
              boxShadow: '0 6px 20px rgba(249, 115, 22, 0.5)',
            },
          }}
        >
          Sell Your Car
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: scrolled 
            ? '1px solid #E2E8F0'
            : '1px solid transparent',
          boxShadow: scrolled 
            ? '0 4px 20px rgba(15, 23, 42, 0.08)'
            : 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              justifyContent: "space-between", 
              py: { xs: 1, md: 1.5 }, 
              px: { xs: 0, md: 1 },
              minHeight: { xs: 64, md: 72 },
            }}
          >
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                transition: "all 0.3s",
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, md: 44 },
                  height: { xs: 40, md: 44 },
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                }}
              >
                <DirectionsCar sx={{ color: '#F97316', fontSize: { xs: 22, md: 26 } }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: '#0F172A',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                AutoHood
              </Typography>
            </Box>

            {/* Search Bar - Hidden on mobile, show in center */}
            {!isTablet && (
              <Box sx={{ flex: 1, maxWidth: 500, mx: 4 }}>
                <Search />
              </Box>
            )}

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'nowrap' }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.to}
                    component={NavLink}
                    to={link.to}
                    size="small"
                    sx={{
                      color: '#475569',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.85rem',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '10px',
                      transition: 'all 0.2s',
                      position: 'relative',
                      minWidth: 'auto',
                      '&:hover': {
                        bgcolor: '#F1F5F9',
                        color: '#0F172A',
                      },
                      '&.active': {
                        color: '#F97316',
                        bgcolor: '#FFF7ED',
                        fontWeight: 600,
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}

                {/* Auth-only nav links */}
                {isAuthenticated && authLinks.map((link) => (
                  <IconButton
                    key={link.to}
                    component={NavLink}
                    to={link.to}
                    sx={{
                      color: '#475569',
                      '&:hover': {
                        bgcolor: '#F1F5F9',
                        color: '#0F172A',
                      },
                      '&.active': {
                        color: '#F97316',
                        bgcolor: '#FFF7ED',
                      },
                    }}
                  >
                    {link.badge > 0 ? (
                      <Badge badgeContent={link.badge} color="error" max={99}>
                        {link.icon}
                      </Badge>
                    ) : (
                      link.icon
                    )}
                  </IconButton>
                ))}

                {!isAuthenticated ? (
                  <>
                    <Button
                      component={NavLink}
                      to="/login"
                      size="small"
                      sx={{
                        color: '#475569',
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        px: 1.5,
                        py: 0.75,
                        borderRadius: '10px',
                        minWidth: 'auto',
                        '&:hover': {
                          bgcolor: '#F1F5F9',
                          color: '#0F172A',
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={NavLink}
                      to="/register"
                      variant="outlined"
                      size="small"
                      sx={{
                        color: '#0F172A',
                        borderColor: '#0F172A',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        px: 2,
                        py: 0.75,
                        borderRadius: '10px',
                        borderWidth: 2,
                        minWidth: 'auto',
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: '#0F172A',
                          color: 'white',
                        },
                      }}
                    >
                      Register
                    </Button>
                  </>
                ) : (
                  <>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '12px',
                        bgcolor: '#F8FAFC',
                        maxWidth: 150,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#0F172A',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                      <Typography
                        sx={{
                          color: '#0F172A',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 80,
                        }}
                      >
                        {user?.name || "User"}
                      </Typography>
                    </Box>
                    <Button
                      onClick={handleLogout}
                      size="small"
                      sx={{
                        color: '#EF4444',
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '10px',
                        minWidth: 'auto',
                        '&:hover': {
                          bgcolor: '#FEF2F2',
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </>
                )}

                <Button
                  component={NavLink}
                  to="/add-car"
                  variant="contained"
                  startIcon={<AddCircle sx={{ fontSize: 18 }} />}
                  size="small"
                  sx={{
                    ml: 0.5,
                    background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                    color: 'white',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    px: 2,
                    py: 1,
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.45)',
                    },
                  }}
                >
                  Sell Car
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{
                    color: '#0F172A',
                    p: 1,
                  }}
                >
                  <MenuIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </Box>
            )}
          </Toolbar>

          {/* Mobile Search Bar */}
          {isTablet && (
            <Box sx={{ pb: 2, px: 1 }}>
              <Search />
            </Box>
          )}
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { lg: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
