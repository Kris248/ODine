import RoomServiceRoundedIcon from "@mui/icons-material/RoomServiceRounded";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = <RoomServiceRoundedIcon sx={{ fontSize: 34 }} />
}) {
  return (
    <Card sx={{ p: { xs: 1, sm: 2 } }}>
      <CardContent>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: { xs: 3, md: 5 } }}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "rgba(155, 91, 61, 0.1)",
              color: "primary.main"
            }}
          >
            {icon}
          </Stack>
          <Stack spacing={1} sx={{ maxWidth: 420 }}>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Stack>
          {actionLabel ? (
            <Button variant="contained" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
