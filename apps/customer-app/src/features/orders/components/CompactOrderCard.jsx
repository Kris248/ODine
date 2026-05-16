import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { ORDER_STATUS_META, normalizeOrderStatus } from "../../../constants/orderStatuses.js";
import { formatCurrency, formatTimeStamp } from "../../../utils/formatters.js";

export function CompactOrderCard({ order, onClick, selected = false }) {
  if (!order) return null;
  const status = normalizeOrderStatus(order.fulfillmentStatus);
  const meta = ORDER_STATUS_META[status];

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        border: selected ? "1px solid rgba(15,118,110,0.38)" : "1px solid rgba(215,224,218,0.9)",
        background: selected
          ? "linear-gradient(135deg, rgba(238,245,242,0.95), rgba(255,255,255,0.98))"
          : "#fff"
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Stack spacing={1.1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Stack spacing={0.1}>
              <Typography fontWeight={850}>{order.orderNumber || order.id}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.table?.label || "Table"} · {order.items?.length || 0} items
              </Typography>
            </Stack>
            <Chip label={meta.shortLabel} color={meta.color} size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(order.pricing?.total || 0, order.pricing?.currency || "INR")} · updated {formatTimeStamp(order.liveStatusUpdatedAt || order.updatedAt || order.createdAt)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
