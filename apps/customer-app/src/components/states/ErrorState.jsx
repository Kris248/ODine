import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export function ErrorState({
  title = "Something went wrong",
  description = "We could not complete this request right now.",
  actionLabel = "Try again",
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon
}) {
  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "68vh", py: 4 }}>
      <Card sx={{ width: "100%", maxWidth: 760 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2.25} alignItems="center" textAlign="center">
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
              {icon || <RefreshRoundedIcon color="primary" />}
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h5">{title}</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                {description}
              </Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              {onAction ? (
                <Button variant="contained" onClick={onAction}>
                  {actionLabel}
                </Button>
              ) : null}
              {onSecondaryAction ? (
                <Button variant="outlined" onClick={onSecondaryAction}>
                  {secondaryActionLabel}
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
