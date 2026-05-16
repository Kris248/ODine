import { alpha, Box, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";

const TONE_MAP = {
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  error: "error",
  default: "primary"
};

export default function StatCard({ label, value, sublabel, icon = null, tone = "primary" }) {
  const theme = useTheme();
  const paletteKey = TONE_MAP[tone] || "primary";
  const color = theme.palette[paletteKey]?.main || theme.palette.primary.main;

  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: { xs: 1.5, md: 1.8 } }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1.4, color: "text.secondary" }}>
              {label}
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: alpha(color, 0.10),
                color
              }}
            >
              {icon}
            </Box>
          </Stack>
          <Typography variant="h3" sx={{ lineHeight: 1, fontSize: { xs: 26, md: 32 } }}>
            {value}
          </Typography>
          {sublabel ? (
            <Typography variant="body2" color="text.secondary">
              {sublabel}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
