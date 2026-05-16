import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import { buildTableGroups, getOrderAgeMinutes, getSeatFrequencyFromOrders, getTableLabel } from "../utils/orderUtils.js";

export default function TableBoard({ orders }) {
  const groups = buildTableGroups(orders);

  return (
    <Stack spacing={1.5} sx={{ minHeight: 0 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
          Table frequency
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
          See which tables are repeating, which seats are active, and which tables need attention.
        </Typography>
      </Box>

      <Box
        className="kds-scroll"
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
          alignItems: "start",
          maxHeight: { xs: "none", lg: "calc(100vh - 330px)" },
          overflow: "auto",
          pr: 0.5
        }}
      >
        {groups.length === 0 ? (
          <Card variant="outlined" sx={{ borderRadius: 3, gridColumn: "1 / -1" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary">No tables are active right now.</Typography>
            </CardContent>
          </Card>
        ) : (
          groups.map((table) => {
            const oldestOrderAge = Math.max(...table.orders.map(getOrderAgeMinutes), 0);
            const seatFrequency = getSeatFrequencyFromOrders(table.orders);

            return (
              <Card key={table.key} sx={{ borderRadius: 3, minHeight: 0 }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Stack spacing={1.1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <TableRestaurantRoundedIcon color="primary" fontSize="small" />
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                            {table.label || getTableLabel(table.orders[0])}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {table.totalOrders} tickets • {table.totalItems} items
                        </Typography>
                      </Box>

                      <Stack alignItems="end" spacing={0.5}>
                        <Chip
                          size="small"
                          color={table.delayed ? "warning" : "success"}
                          label={table.delayed ? `${table.delayed} delayed` : "On track"}
                        />
                        <Chip size="small" variant="outlined" label={`${oldestOrderAge}m oldest`} />
                      </Stack>
                    </Stack>

                    <Divider />

                    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                      {table.statuses.map((entry) => (
                        <Chip
                          key={`${table.key}-${entry.status}`}
                          size="small"
                          color={String(entry.status).toLowerCase() === "ready" ? "success" : String(entry.status).toLowerCase() === "preparing" ? "warning" : "default"}
                          label={`${entry.status} × ${entry.count}`}
                        />
                      ))}
                    </Stack>

                    <Stack spacing={0.65}>
                      <Typography variant="caption" color="text.secondary">
                        Seat repetition
                      </Typography>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        {seatFrequency.length ? (
                          seatFrequency.map((entry) => (
                            <Chip key={`${table.key}-${entry.seat}`} variant="outlined" label={`${entry.seat} × ${entry.count}`} size="small" />
                          ))
                        ) : (
                          <Chip variant="outlined" label="No seat data" size="small" />
                        )}
                      </Stack>
                    </Stack>

                    <Stack spacing={0.65}>
                      <Typography variant="caption" color="text.secondary">
                        Frequent items
                      </Typography>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        {table.items.slice(0, 5).map((item) => (
                          <Chip key={`${table.key}-${item.name}`} color="secondary" variant="outlined" label={`${item.name} × ${item.count}`} size="small" />
                        ))}
                      </Stack>
                    </Stack>

                    <Box
                      sx={{
                        p: 1.15,
                        borderRadius: 2,
                        bgcolor: "rgba(25,118,210,0.04)",
                        border: "1px solid rgba(25,118,210,0.08)"
                      }}
                    >
                      <Stack direction="row" spacing={1.1} alignItems="center">
                        <PendingActionsRoundedIcon color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                            {table.orders.length} live orders
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Oldest ticket has been active for {oldestOrderAge} minutes.
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
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
