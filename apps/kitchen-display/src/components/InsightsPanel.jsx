import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { buildKitchenMetrics, getOrderAgeMinutes, getOrderStatusLabel, getTableLabel, isDelayed, sortOrdersForKitchen } from "../utils/orderUtils.js";

export default function InsightsPanel({ orders }) {
  const metrics = buildKitchenMetrics(orders);
  const sorted = sortOrdersForKitchen(orders);
  const delayedOrders = sorted.filter(isDelayed).slice(0, 5);
  const hottestTable = metrics.busiestTable;
  const readyRate = metrics.total ? Math.round((metrics.ready / metrics.total) * 100) : 0;

  return (
    <Stack spacing={1.4} sx={{ minHeight: 0 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
          Kitchen insights
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
          Focused metrics for rush-hour decisions.
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 1.5 }}>
          <Stack spacing={1.1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <InsightsRoundedIcon color="primary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Live summary
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gap: 0.75,
                gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))" }
              }}
            >
              <MetricBubble label="Tickets" value={metrics.total} />
              <MetricBubble label="Waiting" value={metrics.waiting} />
              <MetricBubble label="Delayed" value={metrics.delayed} accent={metrics.delayed ? "warning.main" : "success.main"} />
              <MetricBubble label="Tables" value={metrics.uniqueTables} />
              <MetricBubble label="Ready" value={metrics.ready} />
              <MetricBubble label="Ready %" value={`${readyRate}%`} accent="primary.main" />
            </Box>

            <Divider />

            <MetricRow label="Average age" value={`${metrics.averageAge}m`} />
            <MetricRow label="Busiest item" value={`${metrics.busiestItem.name} × ${metrics.busiestItem.count}`} />
            <MetricRow label="Busiest table" value={hottestTable ? `${hottestTable.name} × ${hottestTable.count}` : "—"} />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 1.5 }}>
          <Stack spacing={1.1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalFireDepartmentRoundedIcon color="warning" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Delayed tickets
              </Typography>
            </Stack>

            {delayedOrders.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No overdue tickets right now.
              </Typography>
            ) : (
              <Stack spacing={0.75}>
                {delayedOrders.map((order) => (
                  <Box
                    key={order.id}
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "rgba(247,144,9,0.08)",
                      border: "1px solid rgba(247,144,9,0.12)"
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                          {order.orderNumber || `#${order.id}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getTableLabel(order)} • {getOrderAgeMinutes(order)}m old
                        </Typography>
                      </Box>
                      <Chip color="warning" size="small" label={getOrderStatusLabel(order.fulfillmentStatus)} />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 1.5 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <RestaurantRoundedIcon color="primary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Kitchen notes
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Keep the live queue visible, use the batch lane for repeated dishes, and check table frequency before marking an order ready.
            </Typography>
            <Divider />
            <Typography variant="body2" color="text.secondary">
              The fastest boards keep the action buttons one touch away.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 1.5 }}>
          <Stack spacing={0.85}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TimerRoundedIcon color="primary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Prep rhythm
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Target prep under estimated time. Use delay only when the queue genuinely falls behind.
            </Typography>
            <Chip size="small" variant="outlined" label={`Ready rate ${readyRate}%`} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

function MetricBubble({ label, value, accent = "primary.main" }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#fff" }}>
      <CardContent sx={{ p: 1.1 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.05, color: accent }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ fontWeight: 900, textAlign: "right" }}>
        {value}
      </Typography>
    </Box>
  );
}
