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
              width: { xs: "100%", sm: 132 },
              height: { xs: 182, sm: 132 },
              borderRadius: 4,
              objectFit: "cover",
              flexShrink: 0,
              bgcolor: "rgba(226,55,68,0.06)"
            }}
          />

          <Stack spacing={1.1} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={800} noWrap>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
                  {item.description}
                </Typography>
              </Box>

              <IconButton
                onClick={() => onRemove?.(item.key)}
                aria-label={`Remove ${item.name}`}
                sx={{ bgcolor: "rgba(17,24,39,0.04)" }}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>

            {selectionLabel ? (
              <Chip
                label={selectionLabel}
                variant="outlined"
                sx={{
                  alignSelf: "flex-start",
                  maxWidth: "100%",
                  "& .MuiChip-label": { whiteSpace: "normal" }
                }}
              />
            ) : null}

            {item.specialInstructions ? (
              <Typography variant="body2" color="text.secondary">
                Note: {item.specialInstructions}
              </Typography>
            ) : null}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ mt: "auto" }}
            >
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={onDecrease}
                  startIcon={<RemoveRoundedIcon />}
                  sx={{ minWidth: 108 }}
                >
                  {item.quantity}
                </Button>
                <Button
                  variant="outlined"
                  onClick={onIncrease}
                  startIcon={<AddRoundedIcon />}
                  sx={{ minWidth: 108 }}
                >
                  Add
                </Button>
              </Stack>

              <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                <Typography variant="caption" color="text.secondary">
                  Line total
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {formatCurrency(item.unitPrice * item.quantity, currency)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
