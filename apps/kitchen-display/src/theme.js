import { alpha, createTheme } from "@mui/material/styles";

export const kdsTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f97437",
      light: "#ff9a67",
      dark: "#b94a18"
    },
    secondary: {
      main: "#6fd4c0",
      light: "#9ce7d9",
      dark: "#3e9887"
    },
    background: {
      default: "#081217",
      paper: "#0f1d23"
    },
    success: {
      main: "#58c08a"
    },
    warning: {
      main: "#ffb649"
    },
    error: {
      main: "#ff6a6a"
    },
    text: {
      primary: "#f5f7f6",
      secondary: "#96a7a7"
    },
    divider: "rgba(148, 174, 176, 0.16)"
  },
  shape: {
    borderRadius: 20
  },
  typography: {
    fontFamily: '"Aptos", "Trebuchet MS", sans-serif',
    h1: {
      fontFamily: '"Georgia", serif',
      fontWeight: 700
    },
    h2: {
      fontFamily: '"Georgia", serif',
      fontWeight: 700
    },
    h3: {
      fontWeight: 700
    },
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 700
    },
    button: {
      textTransform: "none",
      fontWeight: 700
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(35,82,83,0.35), transparent 36%), linear-gradient(180deg, #091218 0%, #071015 100%)"
        },
        "::selection": {
          backgroundColor: alpha("#f97437", 0.24)
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(148, 174, 176, 0.12)"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          minHeight: 42
        }
      }
    }
  }
});
