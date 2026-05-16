import { alpha, createTheme } from "@mui/material/styles";

const brand = {
  primary: "#E23744",
  primaryDark: "#C71F33",
  primaryLight: "#FFEEF0",
  background: "#FFF8F6",
  surface: "#FFFFFF",
  softSurface: "#FFF3F1",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#F0E3E0"
};

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brand.primary,
      dark: brand.primaryDark,
      light: "#F56A74",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#FF8E6E",
      dark: "#E76A4B",
      light: "#FFD4C9",
      contrastText: "#FFFFFF"
    },
    background: {
      default: brand.background,
      paper: brand.surface
    },
    text: {
      primary: brand.text,
      secondary: brand.muted
    },
    divider: brand.border,
    success: {
      main: "#118A5D"
    },
    warning: {
      main: "#D97706"
    },
    error: {
      main: "#DC2626"
    },
    info: {
      main: "#2563EB"
    }
  },
  shape: {
    borderRadius: 22
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.04em"
    },
    h2: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.03em"
    },
    h3: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.03em"
    },
    h4: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.025em"
    },
    h5: {
      fontWeight: 800,
      letterSpacing: "-0.02em"
    },
    h6: {
      fontWeight: 800,
      letterSpacing: "-0.015em"
    },
    subtitle1: {
      fontWeight: 600
    },
    button: {
      fontWeight: 700,
      textTransform: "none"
    }
  },
  shadows: [
    "none",
    "0 6px 18px rgba(17, 24, 39, 0.04)",
    "0 10px 28px rgba(17, 24, 39, 0.05)",
    "0 16px 36px rgba(17, 24, 39, 0.06)",
    "0 20px 46px rgba(17, 24, 39, 0.07)",
    "0 24px 52px rgba(17, 24, 39, 0.08)",
    "0 28px 60px rgba(17, 24, 39, 0.09)",
    "0 32px 66px rgba(17, 24, 39, 0.10)",
    "0 36px 72px rgba(17, 24, 39, 0.11)",
    "0 40px 82px rgba(17, 24, 39, 0.12)",
    "0 44px 90px rgba(17, 24, 39, 0.13)",
    "0 48px 100px rgba(17, 24, 39, 0.14)",
    "0 52px 108px rgba(17, 24, 39, 0.15)",
    "0 56px 116px rgba(17, 24, 39, 0.16)",
    "0 60px 124px rgba(17, 24, 39, 0.17)",
    "0 64px 132px rgba(17, 24, 39, 0.18)",
    "0 68px 140px rgba(17, 24, 39, 0.19)",
    "0 72px 148px rgba(17, 24, 39, 0.20)",
    "0 76px 156px rgba(17, 24, 39, 0.21)",
    "0 80px 164px rgba(17, 24, 39, 0.22)",
    "0 84px 172px rgba(17, 24, 39, 0.23)",
    "0 88px 180px rgba(17, 24, 39, 0.24)",
    "0 92px 188px rgba(17, 24, 39, 0.25)",
    "0 96px 196px rgba(17, 24, 39, 0.26)",
    "0 100px 204px rgba(17, 24, 39, 0.27)"
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth"
        },
        body: {
          color: brand.text,
          background:
            "radial-gradient(circle at top left, rgba(226, 55, 68, 0.08), transparent 26%), radial-gradient(circle at top right, rgba(255, 142, 110, 0.10), transparent 26%), linear-gradient(180deg, #FFFDFB 0%, #FFF8F6 45%, #FFF4F1 100%)"
        },
        "::selection": {
          backgroundColor: alpha(brand.primary, 0.16)
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          border: `1px solid ${alpha("#E7D8D4", 0.9)}`,
          boxShadow: "0 8px 32px rgba(17, 24, 39, 0.05)"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 18,
          minHeight: 44,
          paddingInline: 18
        },
        contained: {
          backgroundImage: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.primaryDark} 100%)`
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined"
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: "#FFFFFF"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          minHeight: 44
        }
      }
    }
  }
});
