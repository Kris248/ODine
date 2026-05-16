import { alpha, createTheme } from "@mui/material/styles";

const bg = "#f5f7fb";
const paper = "#ffffff";
const ink = "#101828";
const muted = "#667085";

export const kdsTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#4ea0f0",
      dark: "#115293"
    },
    secondary: {
      main: "#0f9d58",
      light: "#36b37e",
      dark: "#0b7240"
    },
    success: {
      main: "#12b76a",
      light: "#32d583"
    },
    warning: {
      main: "#f79009",
      light: "#fdb022"
    },
    error: {
      main: "#f04438"
    },
    background: {
      default: bg,
      paper
    },
    text: {
      primary: ink,
      secondary: muted
    },
    divider: "rgba(16, 24, 40, 0.10)"
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.04em" },
    h2: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.035em" },
    h3: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.03em" },
    h4: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.025em" },
    h5: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
    subtitle2: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha(paper, 0.9),
          borderBottom: "1px solid rgba(16, 24, 40, 0.08)",
          backdropFilter: "blur(18px)"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(16, 24, 40, 0.08)",
          boxShadow: "0 12px 36px rgba(16, 24, 40, 0.08)",
          borderRadius: 16
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
          borderRadius: 12,
          minHeight: 42
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 700
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#ffffff"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined"
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          paddingInline: 14,
          minHeight: 40,
          borderColor: "rgba(16, 24, 40, 0.12)"
        }
      }
    }
  }
});
