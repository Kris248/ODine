import { Box, Container } from "@mui/material";

export function CustomerLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "clip",
        pb: { xs: 16, md: 8 }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 18% 8%, rgba(226, 55, 68, 0.08), transparent 24%), radial-gradient(circle at 82% 12%, rgba(255, 142, 110, 0.10), transparent 22%), radial-gradient(circle at 50% 92%, rgba(226, 55, 68, 0.05), transparent 26%)"
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          px: { xs: 1.5, sm: 2.5, md: 3 },
          pt: { xs: 1.5, sm: 2.5, md: 3 }
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
