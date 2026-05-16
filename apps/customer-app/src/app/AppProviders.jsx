import { CssBaseline, ThemeProvider } from "@mui/material";
import { OrderingProvider } from "../store/OrderingContext.jsx";
import { appTheme } from "../theme/index.js";

export function AppProviders({ children }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <OrderingProvider>{children}</OrderingProvider>
    </ThemeProvider>
  );
}
