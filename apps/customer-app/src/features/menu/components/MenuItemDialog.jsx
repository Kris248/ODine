import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getDefaultSelectionState, resolveSelectedCustomizations } from "../../../utils/cart.js";
import { formatCurrency, formatDietaryLabel, formatSpiceLabel } from "../../../utils/formatters.js";

function OptionButton({ active, label, priceDelta = 0, onClick }) {
  return (
    <Button
      variant={active ? "contained" : "outlined"}
      onClick={onClick}
      sx={{
        justifyContent: "space-between",
        px: 1.5,
        py: 1,
        textAlign: "left",
        alignItems: "center"
      }}
    >
      <span>{label}</span>
      {priceDelta ? <span>{priceDelta > 0 ? `+${priceDelta}` : priceDelta}</span> : null}
    </Button>
  );
}

export function MenuItemDialog({ open, item, currency = "INR", onClose, onAdd }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [selectionState, setSelectionState] = useState({});

  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setInstructions("");
    setSelectionState(getDefaultSelectionState(item.customizationGroups || []));
  }, [item]);

  const selectedCustomizations = useMemo(
    () => resolveSelectedCustomizations(item?.customizationGroups || [], selectionState),
    [item, selectionState]
  );

  if (!item) return null;

  function updateSingle(groupId, optionId) {
    setSelectionState((current) => ({
      ...current,
      [groupId]: optionId
    }));
  }

  function toggleMultiple(groupId, optionId) {
    setSelectionState((current) => {
      const existing = current[groupId] || [];
      const next = existing.includes(optionId)
        ? existing.filter((entry) => entry !== optionId)
        : [...existing, optionId];
      return { ...current, [groupId]: next };
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 5,
          overflow: "hidden",
          bgcolor: "#FFFDFB"
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            sx={{
              width: "100%",
              height: { xs: 240, sm: 320 },
              objectFit: "cover"
            }}
          />
          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "rgba(255,255,255,0.94)"
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.25}>
          <Stack spacing={0.8}>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Box
                sx={{
                  px: 1.25,
                  py: 0.6,
                  borderRadius: 999,
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800
                }}
              >
                {formatCurrency(item.price, currency)}
              </Box>
              <Box
                sx={{
                  px: 1.25,
                  py: 0.6,
                  borderRadius: 999,
                  bgcolor: "rgba(226,55,68,0.10)",
                  color: "primary.main",
                  fontSize: 12,
                  fontWeight: 800
                }}
              >
                {formatDietaryLabel(item.dietaryType)}
              </Box>
              {item.spiceLevel ? (
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.6,
                    borderRadius: 999,
                    bgcolor: "rgba(17,24,39,0.06)",
                    color: "text.secondary",
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  {formatSpiceLabel(item.spiceLevel)}
                </Box>
              ) : null}
            </Stack>
            <Typography variant="h4" sx={{ fontSize: { xs: 24, sm: 30 } }}>
              {item.name}
            </Typography>
            <Typography color="text.secondary">{item.description}</Typography>
          </Stack>

          {item.ingredients?.length ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Ingredients
              </Typography>
              <Typography variant="body2">{item.ingredients.join(" • ")}</Typography>
            </Stack>
          ) : null}

          <Divider />

          <Stack spacing={2}>
            {(item.customizationGroups || []).map((group) => (
              <Stack key={group.id} spacing={1.1}>
                <Typography variant="subtitle1" fontWeight={800}>
                  {group.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {group.required ? "Required" : "Optional"}
                </Typography>

                <Stack spacing={1}>
                  {group.selectionType === "single"
                    ? group.options.map((option) => (
                        <OptionButton
                          key={option.id}
                          label={option.label}
                          priceDelta={option.priceDelta}
                          active={selectionState[group.id] === option.id}
                          onClick={() => updateSingle(group.id, option.id)}
                        />
                      ))
                    : group.options.map((option) => {
                        const active = (selectionState[group.id] || []).includes(option.id);
                        return (
                          <OptionButton
                            key={option.id}
                            label={option.label}
                            priceDelta={option.priceDelta}
                            active={active}
                            onClick={() => toggleMultiple(group.id, option.id)}
                          />
                        );
                      })}
                </Stack>
              </Stack>
            ))}
          </Stack>

          <Divider />

          <Stack spacing={1.25}>
            <Typography variant="subtitle1" fontWeight={800}>
              Special instructions
            </Typography>
            <TextField
              placeholder="Less spicy, sauce on the side, no coriander..."
              multiline
              minRows={3}
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
            />
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              startIcon={<RemoveRoundedIcon />}
              sx={{ minWidth: 132 }}
            >
              {quantity}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setQuantity((current) => current + 1)}
              startIcon={<AddRoundedIcon />}
              sx={{ minWidth: 132 }}
            >
              Add one more
            </Button>
          </Stack>

          <Button
            variant="contained"
            size="large"
            onClick={() =>
              onAdd?.({
                item,
                quantity,
                selectedCustomizations,
                specialInstructions: instructions
              })
            }
            sx={{ py: 1.4 }}
          >
            Add to cart • {formatCurrency(item.price * quantity, currency)}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
