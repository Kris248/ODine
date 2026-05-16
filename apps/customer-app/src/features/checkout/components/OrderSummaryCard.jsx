import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatters.js";

export function OrderSummaryCard({
  title = "Order summary",
  cartItems,
  summary,
  currency,
  showItems = true
}) {
  const taxValue = summary?.taxes ?? summary?.tax ?? 0;
  const serviceValue = summary?.serviceFee ?? summary?.serviceCharge ?? 0;

  return (
    <Card>
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.75}>
          <Typography variant="h5">{title}</Typography>

          {showItems
            ? cartItems.map((item, index) => (
                <Stack
                  key={item.key || `${item.itemId || item.name}-${index}`}
                  direction="row"
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Typography color="text.secondary">
                    {item.quantity} x {item.name}
                  </Typography>
                  <Typography>
                    {formatCurrency(
                      (item.lineTotal ?? item.unitPrice * item.quantity) || 0,
                      currency
                    )}
                  </Typography>
                </Stack>
              ))
            : null}

          {showItems ? <Divider /> : null}

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography>{formatCurrency(summary.subtotal, currency)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Taxes</Typography>
            <Typography>{formatCurrency(taxValue, currency)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Hospitality fee</Typography>
            <Typography>{formatCurrency(serviceValue, currency)}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{formatCurrency(summary.total, currency)}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
