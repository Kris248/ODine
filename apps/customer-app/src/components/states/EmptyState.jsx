import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) {
  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "58vh", py: 4 }}>
      <Card sx={{ width: "100%", maxWidth: 760 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            {icon ? (
              <Box
                sx={{
                  width: 74,
                  height: 74,
                  borderRadius: 5,
                  bgcolor: "rgba(15,118,110,0.08)",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(15,118,110,0.12)"
                }}
              >
                {icon}
              </Box>
            ) : null}
            <Stack spacing={0.75}>
              <Typography variant="h5">{title}</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                {description}
              </Typography>
            </Stack>
            {onAction ? (
              <Button variant="contained" onClick={onAction}>
                {actionLabel}
              </Button>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
