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
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                bgcolor: "rgba(226,55,68,0.10)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <ReceiptLongRoundedIcon color="primary" fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
                {title}
              </Typography>
              {subtitle ? (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          {visibleItems.length ? (
            <Stack spacing={1.2}>
              {visibleItems.map((item) => (
                <Stack key={item.key || `${item.name}-${item.quantity}`} spacing={0.25}>
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {getLineName(item)} × {item.quantity || 1}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatCurrency(getLineTotal(item), currency)}
                    </Typography>
                  </Stack>
                  {item.specialInstructions ? (
                    <Typography variant="caption" color="text.secondary">
                      {item.specialInstructions}
                    </Typography>
                  ) : null}
                </Stack>
              ))}
              {hiddenCount > 0 ? (
                <Typography variant="caption" color="text.secondary">
                  +{hiddenCount} more item{hiddenCount > 1 ? "s" : ""}
                </Typography>
              ) : null}
            </Stack>
          ) : null}

          <Divider />

          <Stack spacing={1.05}>
            <LineRow label="Subtotal" value={formatCurrency(summary.subtotal || 0, currency)} />
            <LineRow
              label={`Taxes (${Math.round((summary.taxRate || 0) * 100)}%)`}
              value={formatCurrency(summary.taxes || 0, currency)}
            />
            <LineRow label="Service fee" value={formatCurrency(summary.serviceFee || 0, currency)} />
          </Stack>

          <Divider />

          <LineRow label="Total" value={formatCurrency(summary.total || 0, currency)} emphasized />
        </Stack>
      </CardContent>
    </Card>
  );
}
