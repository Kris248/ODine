import { Card, CardContent, Stack, Typography, Chip } from "@mui/material";
import { ORDER_STATUS_META, normalizeOrderStatus } from "../../../constants/orderStatuses.js";
import { formatTimeStamp } from "../../../utils/formatters.js";

export function OrderActivityFeed({ order }) {
  const history = Array.isArray(order?.statusHistory) ? [...order.statusHistory] : [];
  const current = normalizeOrderStatus(order?.fulfillmentStatus);

  if (!order) return null;

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={1.75}>
          <Stack spacing={0.4}>
            <Typography variant="subtitle2" color="text.secondary">
              Activity
            </Typography>
            <Typography variant="h6">Order movements</Typography>
          </Stack>

          <Stack spacing={1.25}>
            {history.length ? history.map((entry, index) => {
              const status = normalizeOrderStatus(entry.status);
              const meta = ORDER_STATUS_META[status];
              const isCurrent = status === current;
              return (
                <Stack key={`${status}-${index}`} direction="row" spacing={1.25} alignItems="center">
                  <Chip
                    label={meta.label}
                    color={isCurrent ? meta.color : "default"}
                    variant={isCurrent ? "filled" : "outlined"}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatTimeStamp(entry.at)}
                  </Typography>
                  {entry.by ? (
                    <Typography variant="body2" color="text.secondary">
                      · {entry.by}
                    </Typography>
                  ) : null}
                </Stack>
              );
            }) : (
              <Typography variant="body2" color="text.secondary">
                The kitchen has not sent any updates yet.
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
