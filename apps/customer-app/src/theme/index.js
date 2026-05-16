import { alpha, createTheme } from "@mui/material/styles";

const brand = {
  ink: "#182230",
  text: "#263445",
  muted: "#66758A",
  border: "#D7E0DA",
  background: "#F7F4EE",
  surface: "#FFFFFF",
  softSurface: "#EEF5F2",
  softSurface2: "#F5F7F1",
  primary: "#0F766E",
  primaryDark: "#0A5E57",
  accent: "#C08A3E",
  accentSoft: "#F5E7C8",
  success: "#15936C",
  warning: "#B76E00",
  error: "#C4473D",
  info: "#2563EB"
};

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brand.primary,
      dark: brand.primaryDark,
      light: "#4FAFA7",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: brand.accent,
      dark: "#A77422",
      light: "#E7C98F",
      contrastText: "#FFFFFF"
    },
    background: {
      default: brand.background,
      paper: brand.surface
    },
    text: {
      primary: brand.ink,
      secondary: brand.muted
    },
    divider: brand.border,
    success: { main: brand.success },
    warning: { main: brand.warning },
    error: { main: brand.error },
    info: { main: brand.info }
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.05em" },
    h2: { fontWeight: 800, letterSpacing: "-0.04em" },
    h3: { fontWeight: 800, letterSpacing: "-0.03em" },
    h4: { fontWeight: 800, letterSpacing: "-0.03em" },
    h5: { fontWeight: 750, letterSpacing: "-0.02em" },
    h6: { fontWeight: 750, letterSpacing: "-0.02em" },
    subtitle1: { fontWeight: 650 },
    subtitle2: { fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12 },
    button: { fontWeight: 700, textTransform: "none" }
  },
  shadows: [
    "none",
    "0 4px 12px rgba(24, 34, 48, 0.03)",
    "0 8px 20px rgba(24, 34, 48, 0.04)",
    "0 12px 28px rgba(24, 34, 48, 0.05)",
    "0 16px 34px rgba(24, 34, 48, 0.06)",
    "0 18px 38px rgba(24, 34, 48, 0.07)",
    "0 20px 42px rgba(24, 34, 48, 0.08)",
    "0 22px 46px rgba(24, 34, 48, 0.09)",
    "0 24px 50px rgba(24, 34, 48, 0.10)",
    "0 26px 56px rgba(24, 34, 48, 0.11)",
    "0 28px 60px rgba(24, 34, 48, 0.12)",
    "0 30px 64px rgba(24, 34, 48, 0.13)",
    "0 32px 68px rgba(24, 34, 48, 0.14)",
    "0 34px 72px rgba(24, 34, 48, 0.15)",
    "0 36px 76px rgba(24, 34, 48, 0.16)",
    "0 38px 80px rgba(24, 34, 48, 0.17)",
    "0 40px 84px rgba(24, 34, 48, 0.18)",
    "0 42px 88px rgba(24, 34, 48, 0.19)",
    "0 44px 92px rgba(24, 34, 48, 0.20)",
    "0 46px 96px rgba(24, 34, 48, 0.21)",
    "0 48px 100px rgba(24, 34, 48, 0.22)",
    "0 50px 104px rgba(24, 34, 48, 0.23)",
    "0 52px 108px rgba(24, 34, 48, 0.24)",
    "0 54px 112px rgba(24, 34, 48, 0.25)",
    "0 56px 116px rgba(24, 34, 48, 0.26)"
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: "smooth" },
        body: {
          color: brand.text,
          background:
            "radial-gradient(circle at top left, rgba(15,118,110,0.08), transparent 24%), radial-gradient(circle at top right, rgba(192,138,62,0.10), transparent 22%), linear-gradient(180deg, #FAF8F4 0%, #F7F4EE 44%, #F3EFE7 100%)"
        },
        "::selection": {
          backgroundColor: alpha(brand.primary, 0.16)
        },
        "*::-webkit-scrollbar": {
          width: 10,
          height: 10
        },
        "*::-webkit-scrollbar-thumb": {
          background: "rgba(15, 118, 110, 0.22)",
          borderRadius: 999
        },
        "*::-webkit-scrollbar-track": {
          background: "transparent"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: `1px solid ${alpha(brand.border, 0.9)}`,
          boxShadow: "0 10px 28px rgba(24, 34, 48, 0.05)",
          backgroundImage: "none"
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
          borderRadius: 14,
          minHeight: 44
        },
        contained: {
          background:
            "linear-gradient(135deg, #0F766E 0%, #0B6660 100%)",
          color: "#FFFFFF",
          "&:hover": {
            background:
              "linear-gradient(135deg, #0B6660 0%, #09504B 100%)"
          }
        },
        outlined: {
          borderColor: alpha(brand.primary, 0.24),
          "&:hover": {
            borderColor: alpha(brand.primary, 0.4),
            backgroundColor: alpha(brand.primary, 0.04)
          }
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.92)"
        }
      }
    }
  }
});
