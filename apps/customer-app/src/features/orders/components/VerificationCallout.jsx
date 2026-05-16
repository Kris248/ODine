import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";

export function VerificationCallout({ request, onRequestVerification, onOpenTracking, disabled }) {
  const isActive = Boolean(request?.id);
  const statusLabel = request?.fulfillmentStatus === "verified"
    ? "Verified by waiter"
    : request?.fulfillmentStatus === "verification_requested"
      ? "Waiting for waiter verification"
      : "Ready for quick verification";

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(247,250,252,0.96))",
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.07)"
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifycontent="space-between" alignItems="start" spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Waiter verification
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                {statusLabel}
              </Typography>
            </Box>
            <Chip
              icon={isActive ? <HourglassBottomRoundedIcon fontSize="small" /> : <FactCheckRoundedIcon fontSize="small" />}
              color={request?.fulfillmentStatus === "verified" ? "success" : "warning"}
              label={isActive ? "Live" : "Optional"}
              variant={isActive ? "filled" : "outlined"}
            />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Customer chooses dishes calmly, then requests verification. A waiter checks the list once, confirms it, and the order moves to the kitchen without repeating the whole table conversation.
          </Typography>

          {request?.id ? (
            <Alert severity={request.fulfillmentStatus === "verified" ? "success" : "info"} sx={{ borderRadius: 3 }}>
              Verification ref: {request.orderNumber || request.id}
            </Alert>
          ) : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="contained"
              size="large"
              onClick={onRequestVerification}
              disabled={disabled}
            >
              {isActive ? "Request updated verification" : "Request verification"}
            </Button>
            {isActive ? (
              <Button variant="outlined" size="large" onClick={onOpenTracking}>
                Open live tracker
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
