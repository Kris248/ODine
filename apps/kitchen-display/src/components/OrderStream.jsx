import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import OrderCard from "./OrderCard.jsx";
import { getOrderAgeMinutes, getOrderDisplayNumber, getOrderStatusLabel, getTableLabel, isDelayed } from "../utils/orderUtils.js";

export default function OrderStream({ orders, onStatusChange, updatingOrderId }) {
  const hotOrders = orders.slice(0, 4);

  return (
    <Stack spacing={1.5} sx={{ minHeight: 0 }}>
      <Box sx={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
            Live orders
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
            Small cards, fast actions, and a constant stream of queue updates.
          </Typography>
        </Box>
        <Chip label={`${orders.length} visible`} variant="outlined" />
      </Box>

      {hotOrders.length ? (
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }
          }}
        >
          {hotOrders.map((order) => (
            <Card key={`headline-${order.id}`} sx={{ borderRadius: 3, bgcolor: isDelayed(order) ? "rgba(247,144,9,0.06)" : "rgba(25,118,210,0.05)" }}>
              <CardContent sx={{ p: 1.25 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                      {getOrderDisplayNumber(order)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {getTableLabel(order)} • {getOrderAgeMinutes(order)}m old
                    </Typography>
                  </Box>
                  <Chip size="small" color={isDelayed(order) ? "warning" : "primary"} label={getOrderStatusLabel(order.fulfillmentStatus)} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : null}

      <Box
        className="kds-scroll"
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))"
          },
          alignItems: "start",
          maxHeight: { xs: "none", lg: "calc(100vh - 330px)" },
          overflow: "auto",
          pr: 0.5
        }}
      >
        {orders.length ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              updating={updatingOrderId === order.id}
            />
          ))
        ) : (
          <Card sx={{ borderRadius: 3, gridColumn: "1 / -1" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary">No active orders right now.</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Stack>
  );
}
