import { alpha, createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#9b5b3d",
      light: "#c98762",
      dark: "#6b3821",
      contrastText: "#fffaf6"
    },
    secondary: {
      main: "#6f8060",
      light: "#97ab86",
      dark: "#49533e",
      contrastText: "#f8f3eb"
    },
    background: {
      default: "#f6efe8",
      paper: "rgba(255, 250, 245, 0.88)"
    },
    text: {
      primary: "#201511",
      secondary: "#6a554c"
    },
    success: {
      main: "#3f7a55"
    },
    warning: {
      main: "#be7d2d"
    },
    divider: "rgba(113, 82, 66, 0.12)"
  },
  shape: {
    borderRadius: 22
  },
  typography: {
    fontFamily: '"Aptos", "Trebuchet MS", sans-serif',
    h1: {
      fontFamily: '"Georgia", serif',
      fontWeight: 700,
      letterSpacing: "-0.04em"
    },
    h2: {
      fontFamily: '"Georgia", serif',
      fontWeight: 700,
      letterSpacing: "-0.04em"
    },
    h3: {
      fontFamily: '"Georgia", serif',
      fontWeight: 700,
      letterSpacing: "-0.03em"
    },
    h4: {
      fontFamily: '"Georgia", serif',
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    h5: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    },
    button: {
      fontWeight: 700,
      letterSpacing: "0.01em",
      textTransform: "none"
    }
  },
  shadows: [
    "none",
    "0 12px 30px rgba(80, 55, 38, 0.05)",
    "0 16px 36px rgba(80, 55, 38, 0.08)",
    "0 18px 40px rgba(80, 55, 38, 0.10)",
    "0 24px 48px rgba(80, 55, 38, 0.12)",
    "0 28px 56px rgba(80, 55, 38, 0.14)",
    "0 32px 64px rgba(80, 55, 38, 0.16)",
    "0 34px 70px rgba(80, 55, 38, 0.18)",
    "0 38px 80px rgba(80, 55, 38, 0.20)",
    "0 42px 90px rgba(80, 55, 38, 0.22)",
    "0 48px 96px rgba(80, 55, 38, 0.24)",
    "0 54px 104px rgba(80, 55, 38, 0.26)",
    "0 60px 112px rgba(80, 55, 38, 0.28)",
    "0 66px 120px rgba(80, 55, 38, 0.30)",
    "0 72px 128px rgba(80, 55, 38, 0.32)",
    "0 78px 136px rgba(80, 55, 38, 0.34)",
    "0 84px 146px rgba(80, 55, 38, 0.36)",
    "0 90px 156px rgba(80, 55, 38, 0.38)",
    "0 96px 168px rgba(80, 55, 38, 0.40)",
    "0 102px 180px rgba(80, 55, 38, 0.42)",
    "0 108px 192px rgba(80, 55, 38, 0.44)",
    "0 114px 204px rgba(80, 55, 38, 0.46)",
    "0 120px 216px rgba(80, 55, 38, 0.48)",
    "0 126px 228px rgba(80, 55, 38, 0.50)",
    "0 132px 240px rgba(80, 55, 38, 0.52)"
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": {
          backgroundColor: alpha("#9b5b3d", 0.14)
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(18px)",
          backgroundImage: "none"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          backgroundColor: "rgba(255, 250, 245, 0.9)",
          border: "1px solid rgba(121, 88, 71, 0.08)"
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
          paddingInline: 18,
          minHeight: 44
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          fontWeight: 600
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined"
      }
    }
  }
});
