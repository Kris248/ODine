import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import { formatCurrency, formatTime, getOrderAgeMinutes, getOrderDisplayNumber, getOrderStatusTone, getSeatValues, isDelayed } from "../utils/orderUtils.js";

const STATUS_ACTIONS = [
  { key: "accepted", label: "Accept" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" }
];

export default function OrderTicket({ order, onStatusChange, updating = false }) {
  const ageMinutes = getOrderAgeMinutes(order);
  const delayed = isDelayed(order);
  const statusTone = getOrderStatusTone(order);
  const seatValues = getSeatValues(order);
  const estimatedMinutes = Math.max(6, Number(order?.estimatedPrepTimeMinutes || 18));
  const progress = Math.min(100, Math.round((ageMinutes / estimatedMinutes) * 100));
  const previewItems = (order?.items || []).slice(0, 3);
  const extraItems = Math.max(0, (order?.items || []).length - previewItems.length);

  return (
    <Card
      sx={{
        borderRadius: 4.5,
        overflow: "hidden",
        border: "1px solid",
        borderColor: delayed ? "warning.main" : "divider",
        boxShadow: delayed ? "0 16px 30px rgba(219, 152, 53, 0.14)" : "0 12px 28px rgba(29,43,36,0.08)",
        bgcolor: delayed ? "rgba(255,250,240,0.98)" : "rgba(255,255,255,0.94)"
      }}
    >
      <CardContent sx={{ p: { xs: 1.6, md: 1.9 } }}>
        <Stack spacing={1.3}>
          <Stack direction="row" spacing={1.25} justifyContent="space-between" alignItems="start">
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {getOrderDisplayNumber(order)}
                </Typography>
                <Chip size="small" label={order?.restaurant?.name || "ODine"} variant="outlined" />
              </Stack>

              <Stack direction="row" spacing={0.8} sx={{ mt: 0.9 }} flexWrap="wrap">
                <Chip
                  size="small"
                  icon={<TableRestaurantRoundedIcon sx={{ color: "inherit !important" }} />}
                  label={order?.table?.label || order?.tableLabel || "Table ?"}
                />
                <Chip
                  size="small"
                  icon={<ScheduleRoundedIcon sx={{ color: "inherit !important" }} />}
                  label={`${ageMinutes}m`}
                  color={delayed ? "warning" : "default"}
                />
                <Chip
                  size="small"
                  label={String(order?.fulfillmentStatus || "new").replace(/^\w/, (s) => s.toUpperCase())}
                  color={statusTone}
                />
              </Stack>
            </Box>

            <Stack spacing={0.6} alignItems="end">
              <Chip size="small" color="success" label="Paid" />
              <Typography variant="body2" color="text.secondary">
                {formatTime(order?.createdAt)}
              </Typography>
            </Stack>
          </Stack>

          <Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={delayed ? "warning" : "primary"}
              sx={{ height: 8, borderRadius: 999, bgcolor: "rgba(31,122,87,0.08)" }}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.7 }} spacing={1}>
              <Typography variant="caption" color="text.secondary">
                ETA {estimatedMinutes} min
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Priority {String(order?.prepPriority || "medium")}
              </Typography>
            </Stack>
          </Box>

          {seatValues.length ? (
            <Stack direction="row" spacing={0.7} useFlexGap flexWrap="wrap">
              <Chip
                size="small"
                icon={<LocalDiningRoundedIcon sx={{ color: "inherit !important" }} />}
                label={`Seats ${seatValues.join(", ")}`}
              />
              {seatValues.length > 1 ? <Chip size="small" color="secondary" label={`${seatValues.length} seats`} /> : null}
            </Stack>
          ) : null}

          {order?.notes ? (
            <Alert severity="warning" sx={{ py: 0.25, borderRadius: 3 }}>
              {order.notes}
            </Alert>
          ) : null}

          <Stack spacing={0.9}>
            {previewItems.map((item) => (
              <Box
                key={`${order.id}-${item.itemId || item.name}`}
                sx={{
                  p: 1.15,
                  borderRadius: 3,
                  bgcolor: "rgba(31, 122, 87, 0.04)",
                  border: "1px solid rgba(31, 122, 87, 0.08)"
                }}
              >
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {item.quantity} × {item.name}
                    </Typography>
                    {item.modifiers?.length ? (
                      <Typography variant="caption" color="text.secondary">
                        {item.modifiers
                          .map((modifier) => `${modifier.groupLabel || modifier.group || "Option"}: ${modifier.name}`)
                          .join(" / ")}
                      </Typography>
                    ) : null}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {formatCurrency(item.lineTotal, order?.pricing?.currency)}
                  </Typography>
                </Stack>
                {item.specialInstructions ? (
                  <Typography variant="caption" color="warning.dark" sx={{ display: "block", mt: 0.5 }}>
                    Note: {item.specialInstructions}
                  </Typography>
                ) : null}
              </Box>
            ))}
            {extraItems ? (
              <Typography variant="caption" color="text.secondary">
                + {extraItems} more item{extraItems > 1 ? "s" : ""}
              </Typography>
            ) : null}
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={1.2}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Order total
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
                {formatCurrency(order?.pricing?.total, order?.pricing?.currency)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 0.8,
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(4, minmax(88px, 1fr))"
                }
              }}
            >
              {STATUS_ACTIONS.map((action) => (
                <Button
                  key={action.key}
                  size="small"
                  variant={String(order?.fulfillmentStatus || "") === action.key ? "contained" : "outlined"}
                  color={action.key === "served" ? "success" : "primary"}
                  disabled={updating}
                  onClick={() => onStatusChange(order.id, action.key)}
                  endIcon={<KeyboardDoubleArrowRightRoundedIcon />}
                  sx={{ width: "100%" }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
