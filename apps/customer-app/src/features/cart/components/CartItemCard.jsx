import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatters.js";

export function CartItemCard({ item, currency, onIncrease, onDecrease, onRemove }) {
  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <Box
            sx={{
              width: 96,
              height: 96,
              flexShrink: 0,
              borderRadius: 4,
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />

          <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
              <Box>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(item.unitPrice, currency)} each
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => onRemove(item.key)}
                aria-label={`Remove ${item.name}`}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>

            {item.selectedCustomizations?.length > 0 ? (
              <Typography variant="body2" color="text.secondary">
                {item.selectedCustomizations
                  .map(
                    (group) =>
                      `${group.groupLabel}: ${group.options.map((option) => option.label).join(", ")}`
                  )
                  .join(" / ")}
              </Typography>
            ) : null}

            {item.specialInstructions ? (
              <Typography variant="body2" color="text.secondary">
                Note: {item.specialInstructions}
              </Typography>
            ) : null}

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 99,
                  bgcolor: "rgba(155, 91, 61, 0.08)"
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onDecrease(item.key)}
                  aria-label="Decrease quantity"
                >
                  <RemoveRoundedIcon fontSize="small" />
                </IconButton>
                <Typography fontWeight={700}>{item.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => onIncrease(item.key)}
                  aria-label="Increase quantity"
                >
                  <AddRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Typography variant="h6">
                {formatCurrency(item.unitPrice * item.quantity, currency)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
