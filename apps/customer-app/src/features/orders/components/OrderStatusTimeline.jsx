import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { describeOrderStatus, ORDER_STATUS_META } from "../../../constants/orderStatuses.js";
import { formatTimeStamp } from "../../../utils/formatters.js";

function StatusDot({ active, completed }) {
  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        bgcolor: completed ? "success.main" : active ? "primary.main" : "rgba(102,117,138,0.22)",
        color: completed || active ? "#fff" : "transparent",
        boxShadow: active ? "0 0 0 6px rgba(15,118,110,0.10)" : "none"
      }}
    >
      {completed ? (
        <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />
      ) : active ? (
        <FiberManualRecordRoundedIcon sx={{ fontSize: 10 }} />
      ) : (
        <FiberManualRecordRoundedIcon sx={{ fontSize: 8, opacity: 0.3 }} />
      )}
    </Box>
  );
}

export function OrderStatusTimeline({
  order,
  timeline = [],
  compact = false,
  onOpenHistory,
  rightAction
}) {
  if (!order) return null;
  const meta = describeOrderStatus(order.fulfillmentStatus);

  return (
    <Card sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 2, md: compact ? 2.25 : 3 } }}>
        <Stack spacing={compact ? 1.5 : 2.2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack spacing={0.55}>
              <Typography variant="subtitle2" color="text.secondary">
                Live order tracking
              </Typography>
              <Typography variant={compact ? "h6" : "h5"}>
                {meta.label}
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                {meta.description}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<ScheduleRoundedIcon sx={{ fontSize: 18 }} />}
                label={order.liveStatusUpdatedAt ? `Updated ${formatTimeStamp(order.liveStatusUpdatedAt)}` : "Live"}
                variant="outlined"
              />
              {rightAction}
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gap: compact ? 1.4 : 1.7,
              gridTemplateColumns: "1fr"
            }}
          >
            {timeline.map((step, index) => (
              <Stack
                key={step.key}
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
                sx={{
                  opacity: step.pending ? 0.72 : 1
                }}
              >
                <Stack alignItems="center" spacing={0.5} sx={{ pt: 0.2 }}>
                  <StatusDot active={step.active} completed={step.completed} />
                  {index < timeline.length - 1 ? (
                    <Box
                      sx={{
                        width: 2,
                        flex: 1,
                        minHeight: compact ? 22 : 28,
                        bgcolor: step.completed ? "success.main" : "rgba(102,117,138,0.18)",
                        borderRadius: 999
                      }}
                    />
                  ) : null}
                </Stack>
                <Box sx={{ flex: 1, minWidth: 0, pb: index === timeline.length - 1 ? 0 : 0.5 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                  >
                    <Typography fontWeight={800}>{step.label}</Typography>
                    {step.reachedAt ? (
                      <Typography variant="body2" color="text.secondary">
                        {formatTimeStamp(step.reachedAt)}
                      </Typography>
                    ) : null}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, maxWidth: 720 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>

          {onOpenHistory ? (
            <Box>
              <Chip
                label="View order activity"
                onClick={onOpenHistory}
                variant="outlined"
                sx={{ cursor: "pointer" }}
              />
            </Box>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function OrderStatusSummaryChips({ order }) {
  if (!order) return null;
  const meta = ORDER_STATUS_META[order.fulfillmentStatus] || ORDER_STATUS_META.pending;

  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      <Chip label={meta.shortLabel} color={meta.color || "primary"} />
      <Chip label={order.orderNumber || order.id} variant="outlined" />
      <Chip label={order.table?.label || order.table?.tableNumber || "Table"} variant="outlined" />
      {order.seat ? <Chip label={`Seat ${order.seat.label || order.seat.seatLabel || order.seat.seatId || order.seat}`} variant="outlined" /> : null}
    </Stack>
  );
}
