import { Box, Container } from "@mui/material";

export function CustomerLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        pb: { xs: 12, md: 6 }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 10% 10%, rgba(201, 135, 98, 0.18), transparent 18%), radial-gradient(circle at 88% 8%, rgba(118, 143, 103, 0.16), transparent 24%), radial-gradient(circle at 60% 86%, rgba(201, 135, 98, 0.12), transparent 18%)"
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
