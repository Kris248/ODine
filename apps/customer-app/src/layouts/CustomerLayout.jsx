import { Box, Container } from "@mui/material";

export function CustomerLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "clip",
        pb: { xs: 11, md: 8 }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 12% 8%, rgba(15,118,110,0.09), transparent 22%), radial-gradient(circle at 88% 10%, rgba(192,138,62,0.10), transparent 20%), radial-gradient(circle at 50% 92%, rgba(21,147,108,0.06), transparent 24%)"
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          px: { xs: 1.25, sm: 2.25, md: 3 },
          pt: { xs: 1.25, sm: 2, md: 3 }
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
