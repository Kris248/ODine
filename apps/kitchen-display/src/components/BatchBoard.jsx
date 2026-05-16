import { Box, Card, CardContent, Chip, Divider, LinearProgress, Stack, Typography } from "@mui/material";
import { buildBatchGroups, formatCurrency, formatDateTime, getOrderAgeMinutes } from "../utils/orderUtils.js";

export default function BatchBoard({ orders }) {
  const groups = buildBatchGroups(orders);

  return (
    <Stack spacing={1.5} sx={{ minHeight: 0 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
          Batch cooking
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
          Merge the same dish across tables and seats so chefs can fire batches once.
        </Typography>
      </Box>

      <Box
        className="kds-scroll"
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          alignItems: "start",
          maxHeight: { xs: "none", lg: "calc(100vh - 330px)" },
          overflow: "auto",
          pr: 0.5
        }}
      >
        {groups.length === 0 ? (
          <Card sx={{ borderRadius: 3, gridColumn: "1 / -1" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary">No grouped dishes yet.</Typography>
            </CardContent>
          </Card>
        ) : (
          groups.map((group) => {
            const hotTable = group.tables[0]?.table || "—";
            const seatPreview = group.seats.slice(0, 6);
            const density = Math.min(100, group.totalQuantity * 7);

            return (
              <Card key={group.key} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Stack spacing={1.1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                          {group.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Station {group.station} • {group.orderCount} tickets • {group.totalQuantity} portions
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="flex-end">
                        <Chip size="small" color="primary" label={`Top ${hotTable}`} />
                        <Chip size="small" variant="outlined" label={`${group.delayedOrders} delayed`} />
                        <Chip size="small" variant="outlined" label={`${group.urgentOrders} urgent`} />
                      </Stack>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={density}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                        bgcolor: "rgba(16,24,40,0.06)"
                      }}
                    />

                    <Box
                      sx={{
                        display: "grid",
                        gap: 1,
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }
                      }}
                    >
                      <InfoCard
                        label="Ticket frequency"
                        value={group.orderCount}
                        helper={`${group.tables.length} tables, ${group.seats.length || 0} seat variants`}
                      />
                      <InfoCard
                        label="Loaded value"
                        value={formatCurrency(group.lineTotal)}
                        helper={`Started ${formatDateTime(group.earliestCreatedAt)} • ${getOrderAgeMinutes({ createdAt: group.earliestCreatedAt })}m oldest`}
                      />
                    </Box>

                    <GroupLine title="Table frequency" chips={group.tables.slice(0, 6).map((entry) => `${entry.table} × ${entry.count}`)} />
                    <GroupLine title="Seat frequency" chips={seatPreview.length ? seatPreview.map((entry) => `${entry.seat} × ${entry.count}`) : ["No seat data"]} tone="secondary" />
                    <GroupLine title="Status mix" chips={group.statuses.map((entry) => `${entry.status} × ${entry.count}`)} tone="default" />

                    <Divider />

                    <Stack spacing={0.75}>
                      <Typography variant="caption" color="text.secondary">
                        Orders in this batch
                      </Typography>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        {group.orders.slice(0, 10).map((order) => (
                          <Chip
                            key={order.orderId}
                            size="small"
                            label={`${order.orderNumber} • ${order.tableLabel}${order.seatValues?.length ? ` • ${order.seatValues.join(", ")}` : ""}`}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Stack>
  );
}

function GroupLine({ title, chips, tone = "primary" }) {
  return (
    <Stack spacing={0.65}>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
        {chips.map((chip) => (
          <Chip
            key={`${title}-${chip}`}
            size="small"
            color={tone === "secondary" ? "secondary" : tone === "default" ? "default" : "primary"}
            variant="outlined"
            label={chip}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function InfoCard({ label, value, helper }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#fff" }}>
      <CardContent sx={{ p: 1.25 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.05, mt: 0.3 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
          {helper}
        </Typography>
      </CardContent>
    </Card>
  );
}
