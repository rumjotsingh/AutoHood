import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Avatar,
  Fade,
  Slide,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DirectionsCar, Logout, Login, PersonAdd, AddCircle } from "@mui/icons-material";
import Search from "../pages/Search";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout as logoutAction } from '../redux/slices/authSlice';
function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  console.log(user)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logout successful!", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate("/login", { replace: true });
  };
const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <Slide direction="down" in timeout={600}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: scrolled 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          borderBottom: scrolled 
            ? "1px solid rgba(255, 255, 255, 0.2)" 
            : "1px solid rgba(102, 126, 234, 0.15)",
          boxShadow: scrolled 
            ? "0 10px 40px rgba(102, 126, 234, 0.35), 0 4px 12px rgba(0, 0, 0, 0.1)" 
            : "0 4px 20px rgba(102, 126, 234, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05)",
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: { xs: 0.5, md: 1 }, px: { xs: 1, md: 2 } }}>
          {/* Logo */}
          <Box
            component={NavLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 1.5 },
              textDecoration: "none",
              transition: "all 0.3s",
              px: { xs: 1, md: 2 },
              py: { xs: 0.5, md: 1 },
              borderRadius: 2,
              flexShrink: 0,
              "&:hover": {
                transform: "scale(1.05)",
                bgcolor: scrolled ? "rgba(255,255,255,0.1)" : "rgba(102, 126, 234, 0.1)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 36, md: 44 },
                height: { xs: 36, md: 44 },
                borderRadius: "50%",
                background: scrolled 
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)" 
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: scrolled 
                  ? "0 6px 20px rgba(255, 255, 255, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3)" 
                  : "0 6px 20px rgba(102, 126, 234, 0.5), 0 0 0 3px rgba(102, 126, 234, 0.1)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                border: scrolled 
                  ? "2px solid rgba(255, 255, 255, 0.4)" 
                  : "2px solid transparent",
                animation: scrolled ? "none" : "pulse 3s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5), 0 0 0 3px rgba(102, 126, 234, 0.1)" },
                  "50%": { boxShadow: "0 8px 30px rgba(102, 126, 234, 0.7), 0 0 0 5px rgba(102, 126, 234, 0.15)" },
                },
              }}
            >
              <DirectionsCar 
                sx={{ 
                  fontSize: { xs: 20, md: 26 }, 
                  color: "white",
                  transition: "all 0.4s",
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                }} 
              />
            </Box>
            {!isMobile && (
              <Typography
                variant="h5"
                fontWeight="800"
                sx={{
                  background: scrolled 
                    ? "white" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: scrolled ? "white" : "transparent",
                  textShadow: scrolled 
                    ? "0 2px 12px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(255, 255, 255, 0.2)" 
                    : "none",
                  transition: "all 0.4s",
                  letterSpacing: "1px",
                  fontSize: { md: '1.5rem', lg: '1.75rem' },
                  textTransform: "uppercase",
                  position: "relative",
                }}
              >
                AutoHood
              </Typography>
            )}
          </Box>

          {/* Search */}
          <Box sx={{ flex: 1, maxWidth: { xs: 300, sm: 400, md: 500 }, mx: { xs: 1, sm: 2, md: 4 } }}>
            <Search />
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <Button
              component={NavLink}
              to="/"
              startIcon={<DirectionsCar />}
              sx={{
                color: scrolled ? "white" : "#667eea",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                px: 2.5,
                py: 1,
                borderRadius: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  bgcolor: scrolled ? "rgba(255,255,255,0.15)" : "rgba(102, 126, 234, 0.12)",
                  transform: "translateY(-2px)",
                  boxShadow: scrolled 
                    ? "0 4px 12px rgba(255, 255, 255, 0.2)" 
                    : "0 4px 12px rgba(102, 126, 234, 0.2)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: scrolled ? "white" : "linear-gradient(90deg, #667eea, #764ba2)",
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s ease",
                },
                "&:hover::before": {
                  transform: "scaleX(1)",
                },
              }}
            >
              Home
            </Button>

            {!isAuthenticated ? (
              <>
                <Button
                  component={NavLink}
                  to="/login"
                  startIcon={<Login />}
                  sx={{
                    color: scrolled ? "white" : "#667eea",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: scrolled ? "rgba(255,255,255,0.15)" : "rgba(102, 126, 234, 0.12)",
                      transform: "translateY(-2px)",
                      boxShadow: scrolled 
                        ? "0 4px 12px rgba(255, 255, 255, 0.2)" 
                        : "0 4px 12px rgba(102, 126, 234, 0.2)",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={NavLink}
                  to="/register"
                  startIcon={<PersonAdd />}
                  variant="contained"
                  sx={{
                    background: scrolled 
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)" 
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: scrolled ? "#667eea" : "white",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "1rem",
                    px: 3.5,
                    py: 1.2,
                    borderRadius: 2.5,
                    border: scrolled ? "2px solid rgba(102, 126, 234, 0.3)" : "none",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: scrolled 
                      ? "0 4px 15px rgba(255, 255, 255, 0.3)" 
                      : "0 6px 20px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: scrolled 
                        ? "0 8px 25px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(102, 126, 234, 0.3)" 
                        : "0 10px 30px rgba(102, 126, 234, 0.6)",
                      background: scrolled 
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%)" 
                        : "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      transition: "left 0.6s",
                    },
                    "&:hover::before": {
                      left: "100%",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mx: 2, px: 2, py: 1, borderRadius: 2, transition: "all 0.3s", "&:hover": { bgcolor: scrolled ? "rgba(255,255,255,0.1)" : "rgba(102, 126, 234, 0.08)" } }}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: scrolled ? "white" : "#667eea",
                      color: scrolled ? "#667eea" : "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      boxShadow: scrolled 
                        ? "0 4px 12px rgba(255, 255, 255, 0.3)" 
                        : "0 4px 12px rgba(102, 126, 234, 0.3)",
                      border: scrolled ? "2px solid rgba(255, 255, 255, 0.3)" : "2px solid transparent",
                      transition: "all 0.3s",
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Typography
                    sx={{
                      color: scrolled ? "white" : "#667eea",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
                    }}
                  >
                    {user?.name || "User"}
                  </Typography>
                </Box>
                <Button
                  onClick={handleLogout}
                  startIcon={<Logout />}
                  sx={{
                    color: scrolled ? "rgba(255, 255, 255, 0.95)" : "#f5576c",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    border: scrolled ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(245, 87, 108, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: scrolled ? "rgba(255, 87, 108, 0.2)" : "rgba(245, 87, 108, 0.12)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(245, 87, 108, 0.3)",
                      borderColor: "#f5576c",
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
              startIcon={<AddCircle />}
              variant="contained"
              sx={{
                background: scrolled 
                  ? "linear-gradient(135deg, rgba(245, 87, 108, 0.95) 0%, rgba(240, 147, 251, 0.9) 100%)" 
                  : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                px: 3.5,
                py: 1.2,
                borderRadius: 2.5,
                border: scrolled ? "2px solid rgba(255, 255, 255, 0.4)" : "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(245, 87, 108, 0.45)",
                "&:hover": {
                  transform: "translateY(-3px) scale(1.02)",
                  boxShadow: "0 10px 35px rgba(245, 87, 108, 0.6), 0 4px 15px rgba(240, 147, 251, 0.4)",
                  background: scrolled 
                    ? "linear-gradient(135deg, rgba(245, 87, 108, 1) 0%, rgba(240, 147, 251, 1) 100%)" 
                    : "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "0",
                  height: "0",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.4)",
                  transform: "translate(-50%, -50%)",
                  transition: "width 0.6s, height 0.6s",
                },
                "&:hover::after": {
                  width: "300px",
                  height: "300px",
                },
              }}
            >
              Add Car
            </Button>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              edge="end"
              onClick={handleMenuOpen}
              sx={{
                color: scrolled ? "white" : "#667eea",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <Badge badgeContent={isAuthenticated ? "✓" : null} color="success">
                <MenuIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 220,
                  maxWidth: 280,
                  background: "white",
                  
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
                },
              }}
            >
              <MenuItem
                component={NavLink}
                to="/"
                onClick={handleMenuClose}
                sx={{
                  py: 1.5,
                  gap: 1,
                  "&:hover": {
                    bgcolor: "rgba(102, 126, 234, 0.1)",
                  },
                }}
              >
                <DirectionsCar fontSize="small" />
                Home
              </MenuItem>

              {!isAuthenticated ? (
                <>
                  <MenuItem
                    component={NavLink}
                    to="/login"
                    onClick={handleMenuClose}
                    sx={{
                      py: 1.5,
                      gap: 1,
                      "&:hover": {
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                      },
                    }}
                  >
                    <Login fontSize="small" />
                    Login
                  </MenuItem>
                  <MenuItem
                    component={NavLink}
                    to="/register"
                    onClick={handleMenuClose}
                    sx={{
                      py: 1.5,
                      gap: 1,
                      "&:hover": {
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                      },
                    }}
                  >
                    <PersonAdd fontSize="small" />
                    Register
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    disabled
                    sx={{
                      py: 1.5,
                      gap: 1,
                      fontWeight: 600,
                      color: "#667eea !important",
                    }}
                  >
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.8rem" }}>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    {user?.name || "User"}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleMenuClose();
                    }}
                    sx={{
                      py: 1.5,
                      gap: 1,
                      color: "#f5576c",
                      "&:hover": {
                        bgcolor: "rgba(245, 87, 108, 0.1)",
                      },
                    }}
                  >
                    <Logout fontSize="small" />
                    Logout
                  </MenuItem>
                </>
              )}

              <MenuItem
                component={NavLink}
                to="/add-car"
                onClick={handleMenuClose}
                sx={{
                  py: 1.5,
                  gap: 1,
                  color: "#f5576c",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)",
                  mt: 1,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "rgba(245, 87, 108, 0.2)",
                    transform: "translateX(5px)",
                  },
                }}
              >
                <AddCircle fontSize="small" />
                Add Car
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
export default Navbar;
