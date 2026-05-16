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
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import {
  describeOrder,
  formatCurrency,
  formatTime,
  getOrderAgeMinutes,
  getOrderDisplayNumber,
  getOrderPreviewItems,
  getOrderStatusLabel,
  getOrderStatusTone,
  getSeatValues,
  getTableLabel,
  isDelayed
} from "../utils/orderUtils.js";

const STATUS_ACTIONS = [
  { key: "new", label: "Pending", icon: <PendingActionsRoundedIcon fontSize="small" />, color: "inherit" },
  { key: "accepted", label: "Accept", icon: <DoneRoundedIcon fontSize="small" />, color: "primary" },
  { key: "preparing", label: "Preparing", icon: <RestaurantMenuRoundedIcon fontSize="small" />, color: "secondary" },
  { key: "ready", label: "Ready", icon: <KeyboardDoubleArrowRightRoundedIcon fontSize="small" />, color: "success" },
  { key: "served", label: "Served", icon: <DoneRoundedIcon fontSize="small" />, color: "success" }
];

export default function OrderCard({ order, onStatusChange, updating }) {
  const age = getOrderAgeMinutes(order);
  const delayed = isDelayed(order);
  const seatValues = getSeatValues(order);
  const previewItems = getOrderPreviewItems(order, 3);
  const extraItems = Math.max((order?.items || []).length - previewItems.length, 0);
  const statusTone = getOrderStatusTone(order);

  const progressValue = Math.min(100, (age / Math.max(1, Number(order?.estimatedPrepTimeMinutes || 18))) * 100);

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        borderLeft: delayed ? "4px solid #f79009" : "4px solid #1976d2",
        minHeight: 0
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Stack spacing={1.1}>
          <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                {getOrderDisplayNumber(order)}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {getTableLabel(order)} • {describeOrder(order).split("•").slice(1).join("•")}
              </Typography>
            </Box>

            <Stack alignItems="end" spacing={0.6}>
              <Chip
                size="small"
                color={statusTone === "default" ? "default" : statusTone}
                label={getOrderStatusLabel(order.fulfillmentStatus)}
              />
              <Chip size="small" variant="outlined" icon={<AccessTimeRoundedIcon fontSize="small" />} label={`${age}m`} />
            </Stack>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: "rgba(16,24,40,0.06)",
              "& .MuiLinearProgress-bar": {
                bgcolor: delayed ? "warning.main" : "primary.main"
              }
            }}
          />

          {seatValues.length ? (
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" alignItems="center">
              <Chip icon={<TableRestaurantRoundedIcon fontSize="small" />} label={`Seats ${seatValues.join(", ")}`} size="small" variant="outlined" />
              {seatValues.length > 1 ? <Chip size="small" color="secondary" label={`${seatValues.length} seats`} /> : null}
            </Stack>
          ) : null}

          {delayed ? (
            <Alert severity="warning" sx={{ py: 0, borderRadius: 2 }}>
              Delayed beyond ETA. Push this ticket now.
            </Alert>
          ) : null}

          {order?.notes ? (
            <Alert severity="info" sx={{ py: 0, borderRadius: 2 }}>
              {order.notes}
            </Alert>
          ) : null}

          <Stack spacing={0.7}>
            {previewItems.map((item) => (
              <Box
                key={`${order.id}-${item.itemId || item.name}`}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "rgba(25,118,210,0.04)",
                  border: "1px solid rgba(25,118,210,0.08)"
                }}
              >
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                      {item.quantity} × {item.name}
                    </Typography>
                    {item.modifiers?.length ? (
                      <Typography variant="caption" color="text.secondary">
                        {item.modifiers.map((modifier) => `${modifier.groupLabel || modifier.group || "Option"}: ${modifier.name}`).join(" / ")}
                      </Typography>
                    ) : null}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {formatCurrency(item.lineTotal, order?.pricing?.currency)}
                  </Typography>
                </Stack>
                {item.specialInstructions ? (
                  <Typography variant="caption" color="warning.dark" sx={{ display: "block", mt: 0.4 }}>
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
            spacing={1}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.05 }}>
                {formatCurrency(order?.pricing?.total, order?.pricing?.currency)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(order?.createdAt)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 0.75,
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(92px, 1fr))"
                },
                width: "100%"
              }}
            >
              {STATUS_ACTIONS.map((action) => {
                const active = String(order?.fulfillmentStatus || "").toLowerCase() === action.key;
                return (
                  <Button
                    key={action.key}
                    size="small"
                    variant={active ? "contained" : "outlined"}
                    color={action.color}
                    disabled={updating}
                    onClick={() => onStatusChange(order.id, action.key)}
                    sx={{
                      minHeight: 38,
                      px: 1,
                      fontSize: 11.5,
                      justifyContent: "flex-start"
                    }}
                    startIcon={action.icon}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
