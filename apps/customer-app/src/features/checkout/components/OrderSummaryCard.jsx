import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatters.js";

function LineRow({ label, value, emphasized = false }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
      <Typography variant={emphasized ? "subtitle1" : "body2"} fontWeight={emphasized ? 800 : 600}>
        {label}
      </Typography>
      <Typography variant={emphasized ? "subtitle1" : "body2"} fontWeight={emphasized ? 800 : 700}>
        {value}
      </Typography>
    </Stack>
  );
}

function getLineName(entry) {
  return entry.name || entry.itemName || "Item";
}

function getLineTotal(entry) {
  return typeof entry.lineTotal === "number" ? entry.lineTotal : (entry.unitPrice || 0) * (entry.quantity || 1);
}

export function OrderSummaryCard({
  title = "Order summary",
  subtitle,
  cartItems = [],
  summary = {},
  currency = "INR"
}) {
  const visibleItems = cartItems.slice(0, 4);
  const hiddenCount = Math.max(0, cartItems.length - visibleItems.length);

  return (
    <Card sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(15,118,110,0.08)"
              }}
            >
              <ReceiptLongRoundedIcon color="primary" />
            </Box>
            <Stack spacing={0.2}>
              <Typography variant="h6">{title}</Typography>
              {subtitle ? (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              ) : null}
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1.2}>
            {visibleItems.map((item) => (
              <LineRow
                key={item.key || item.itemId || getLineName(item)}
                label={`${item.quantity || 1} × ${getLineName(item)}`}
                value={formatCurrency(getLineTotal(item), currency)}
              />
            ))}
            {hiddenCount > 0 ? (
              <Typography variant="body2" color="text.secondary">
                +{hiddenCount} more item{hiddenCount === 1 ? "" : "s"}
              </Typography>
            ) : null}
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <LineRow label="Subtotal" value={formatCurrency(summary.subtotal || 0, currency)} />
            <LineRow label={`Tax (${Math.round((summary.taxRate || 0) * 100)}%)`} value={formatCurrency(summary.taxes || 0, currency)} />
            {summary.serviceFee ? (
              <LineRow label="Service fee" value={formatCurrency(summary.serviceFee || 0, currency)} />
            ) : null}
            <Box
              sx={{
                mt: 0.5,
                p: 1.4,
                borderRadius: 3,
                bgcolor: "rgba(15,118,110,0.06)"
              }}
            >
              <LineRow emphasized label="Total" value={formatCurrency(summary.total || 0, currency)} />
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
