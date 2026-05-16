import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../constants/routes.js";
import { useOrdering } from "../../../store/OrderingContext.jsx";
import { useLiveOrderTracking } from "../../../hooks/useLiveOrderTracking.js";
import { OrderStatusSummaryChips } from "./OrderStatusTimeline.jsx";
import { formatCurrency } from "../../../utils/formatters.js";

export function LiveOrderBanner({
  order,
  restaurantId,
  tableId,
  seatId = "",
  dense = false,
  onOpenTracking
}) {
  const navigate = useNavigate();
  const { setLastOrder } = useOrdering();
  const { order: liveOrder, statusLabel } = useLiveOrderTracking(order?.id, { initialOrder: order, enabled: Boolean(order?.id) });
  const currentOrder = liveOrder || order;

  useEffect(() => {
    if (currentOrder?.id) {
      setLastOrder(currentOrder);
    }
  }, [currentOrder, setLastOrder]);

  if (!currentOrder) return null;

  return (
    <Card
      sx={{
        border: "1px solid rgba(15,118,110,0.16)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(238,245,242,0.98) 100%)"
      }}
    >
      <CardContent sx={{ p: dense ? 2 : { xs: 2, md: 2.5 } }}>
        <Stack spacing={dense ? 1.25 : 1.75}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.25}
          >
            <Stack spacing={0.4}>
              <Typography variant="subtitle2" color="text.secondary">
                Live order
              </Typography>
              <Typography variant={dense ? "h6" : "h5"}>
                {statusLabel}
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 580 }}>
                Chef updates appear here instantly as the kitchen moves your table through the queue.
              </Typography>
            </Stack>
            <Chip
              icon={<NotificationsActiveRoundedIcon sx={{ fontSize: 18 }} />}
              label={currentOrder.orderNumber || currentOrder.id}
              variant="outlined"
            />
          </Stack>

          <OrderStatusSummaryChips order={currentOrder} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Typography color="text.secondary">
              Total {formatCurrency(currentOrder.pricing?.total || 0, currentOrder.pricing?.currency || "INR")} · {currentOrder.items?.length || 0} items
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() =>
                  onOpenTracking
                    ? onOpenTracking()
                    : navigate(APP_ROUTES.tracking(restaurantId, tableId, currentOrder.id, seatId))
                }
              >
                Track live
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() =>
                  navigate(APP_ROUTES.tracking(restaurantId, tableId, currentOrder.id, seatId))
                }
              >
                Open details
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
