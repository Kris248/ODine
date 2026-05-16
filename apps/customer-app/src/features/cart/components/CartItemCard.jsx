import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, Button, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatters.js";

function getSelectionLabel(entry) {
  const groups = entry.selectedCustomizations || entry.modifiers || [];
  if (!groups.length) return null;
  return groups
    .map((group) => `${group.groupLabel || group.groupId}: ${(group.options || []).map((option) => option.label || option.name).join(", ")}`)
    .join(" • ");
}

export function CartItemCard({
  item,
  currency = "INR",
  onIncrease,
  onDecrease,
  onRemove
}) {
  const selectionLabel = getSelectionLabel(item);

  return (
    <Card sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.75}>
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            sx={{
              width: { xs: "100%", sm: 126 },
              height: { xs: 160, sm: 126 },
              borderRadius: 3,
              objectFit: "cover",
              flexShrink: 0
            }}
          />

          <Stack spacing={1.2} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.25}>
              <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={850} noWrap>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                  {item.description}
                </Typography>
              </Stack>
              <IconButton
                onClick={() => onRemove(item.key)}
                aria-label={`Remove ${item.name}`}
                sx={{
                  bgcolor: "rgba(196,71,61,0.08)",
                  border: "1px solid rgba(196,71,61,0.12)"
                }}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>

            {selectionLabel ? (
              <Chip label={selectionLabel} variant="outlined" size="small" sx={{ width: "fit-content" }} />
            ) : null}

            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.25}>
              <Typography variant="h6" sx={{ fontSize: 20 }}>
                {formatCurrency(item.unitPrice * item.quantity, currency)}
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => onDecrease(item.key)}
                  aria-label={`Decrease ${item.name}`}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <RemoveRoundedIcon fontSize="small" />
                </IconButton>
                <Box
                  sx={{
                    minWidth: 38,
                    px: 1.25,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    bgcolor: "rgba(15,118,110,0.06)",
                    fontWeight: 800
                  }}
                >
                  {item.quantity}
                </Box>
                <IconButton
                  onClick={() => onIncrease(item.key)}
                  aria-label={`Increase ${item.name}`}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <AddRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
