// AutoHood Design System - Professional UI/UX Revamp
// Based on modern automotive service-tech brand guidelines

import { createTheme } from "@mui/material/styles";

// Color Palette - Professional & Premium
export const colors = {
  // Primary Colors
  primary: {
    main: "#0F172A", // Dark Blue/Charcoal - main brand color
    light: "#1E293B", // Slate 800
    dark: "#020617", // Slate 950
    contrastText: "#FFFFFF",
  },
  // Secondary/Accent Colors
  secondary: {
    main: "#F97316", // Orange - CTA focused
    light: "#FB923C", // Orange 400
    dark: "#EA580C", // Orange 600
    contrastText: "#FFFFFF",
  },
  // Success Color
  success: {
    main: "#10B981", // Emerald 500
    light: "#34D399", // Emerald 400
    dark: "#059669", // Emerald 600
    contrastText: "#FFFFFF",
  },
  // Error Color
  error: {
    main: "#EF4444", // Red 500
    light: "#F87171", // Red 400
    dark: "#DC2626", // Red 600
    contrastText: "#FFFFFF",
  },
  // Warning Color
  warning: {
    main: "#F59E0B", // Amber 500
    light: "#FBBF24", // Amber 400
    dark: "#D97706", // Amber 600
    contrastText: "#FFFFFF",
  },
  // Info Color
  info: {
    main: "#3B82F6", // Blue 500
    light: "#60A5FA", // Blue 400
    dark: "#2563EB", // Blue 600
    contrastText: "#FFFFFF",
  },
  // Background Colors
  background: {
    default: "#F8FAFC", // Slate 50 - Off-white
    paper: "#FFFFFF",
    subtle: "#F1F5F9", // Slate 100
    elevated: "#FFFFFF",
  },
  // Text Colors
  text: {
    primary: "#1E293B", // Slate 800 - Dark gray (not pure black)
    secondary: "#64748B", // Slate 500
    disabled: "#94A3B8", // Slate 400
    hint: "#CBD5E1", // Slate 300
  },
  // Neutral Colors
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },
  // Gradient Presets
  gradients: {
    primary: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    accent: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
    success: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    hero: "linear-gradient(135deg, #0F172A 0%, #334155 50%, #1E293B 100%)",
    subtle: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
    card: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
  },
};

// Typography
export const typography = {
  fontFamily:
    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: {
    fontWeight: 800,
    fontSize: "3.5rem",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontWeight: 700,
    fontSize: "2.5rem",
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  h3: {
    fontWeight: 700,
    fontSize: "2rem",
    lineHeight: 1.4,
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: 1.5,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.7,
    fontWeight: 400,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.6,
    fontWeight: 400,
  },
  button: {
    fontWeight: 600,
    fontSize: "0.9375rem",
    textTransform: "none",
    letterSpacing: "0.01em",
  },
  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.5,
    fontWeight: 400,
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
};

// Spacing & Sizing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  xxl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
  glow: "0 0 40px rgba(249, 115, 22, 0.3)",
  card: "0 4px 20px rgba(15, 23, 42, 0.08)",
  cardHover: "0 12px 40px rgba(15, 23, 42, 0.15)",
};

// Transitions
export const transitions = {
  fast: "all 0.15s ease",
  normal: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
};

// Create MUI Theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: colors.background,
    text: colors.text,
  },
  typography: {
    ...typography,
  },
  shape: {
    borderRadius: borderRadius.md,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          padding: "12px 24px",
          fontWeight: 600,
          transition: transitions.normal,
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        contained: {
          boxShadow: shadows.md,
          "&:hover": {
            boxShadow: shadows.lg,
          },
        },
        containedPrimary: {
          background: colors.primary.main,
          "&:hover": {
            background: colors.primary.light,
          },
        },
        containedSecondary: {
          background: colors.gradients.accent,
          "&:hover": {
            background: colors.secondary.dark,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.card,
          border: `1px solid ${colors.neutral[200]}`,
          transition: transitions.normal,
          "&:hover": {
            boxShadow: shadows.cardHover,
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
        },
        elevation1: {
          boxShadow: shadows.sm,
        },
        elevation2: {
          boxShadow: shadows.md,
        },
        elevation3: {
          boxShadow: shadows.lg,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: borderRadius.md,
            transition: transitions.fast,
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary.light,
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.secondary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadows.sm,
        },
      },
    },
  },
});

export default theme;
