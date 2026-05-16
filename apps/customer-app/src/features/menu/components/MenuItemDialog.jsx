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
        alignItems: "center",
        minHeight: 42
      }}
    >
      <span>{label}</span>
      {priceDelta ? <span>{priceDelta > 0 ? `+${priceDelta}` : priceDelta}</span> : null}
    </Button>
  );
}

export function MenuItemDialog({ open, item, currency = "INR", onClose, onAdd }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectionState, setSelectionState] = useState({});

  const customizationGroups = item?.customizationGroups || [];

  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSpecialInstructions("");
    setSelectionState(getDefaultSelectionState(customizationGroups));
  }, [item, customizationGroups]);

  const selectedCustomizations = useMemo(
    () => resolveSelectedCustomizations(customizationGroups, selectionState),
    [customizationGroups, selectionState]
  );

  const customizationDelta = useMemo(
    () =>
      selectedCustomizations.reduce(
        (groupTotal, group) =>
          groupTotal +
          group.options.reduce((optionTotal, option) => optionTotal + (option.priceDelta || 0), 0),
        0
      ),
    [selectedCustomizations]
  );

  const basePrice = item?.price || 0;
  const unitPrice = basePrice + customizationDelta;
  const total = unitPrice * quantity;

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.4}>
            <Typography variant="h5">{item.name}</Typography>
            <Typography color="text.secondary">
              {formatDietaryLabel(item.dietaryType)} · {item.spiceLevel ? formatSpiceLabel(item.spiceLevel) : "Chef's blend"}
            </Typography>
          </Stack>
          <IconButton onClick={onClose} aria-label="Close dialog">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5
          }}
        >
          <Box>
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={{
                width: "100%",
                aspectRatio: "1.1 / 1",
                objectFit: "cover",
                borderRadius: 4
              }}
            />
          </Box>

          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {item.description}
              </Typography>
              <Typography variant="h5">{formatCurrency(unitPrice, currency)}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Quantity
              </Typography>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <IconButton
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  aria-label="Decrease quantity"
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <RemoveRoundedIcon />
                </IconButton>
                <Typography sx={{ minWidth: 28, textAlign: "center", fontWeight: 800 }}>{quantity}</Typography>
                <IconButton
                  onClick={() => setQuantity((current) => current + 1)}
                  aria-label="Increase quantity"
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <AddRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>

            {customizationGroups.map((group) => {
              const selected = selectionState[group.id] || (group.selectionType === "single" ? "" : []);
              return (
                <Stack key={group.id} spacing={1}>
                  <Stack spacing={0.25}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      {group.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {group.selectionType === "single" ? "Choose one" : "Choose any that fit your taste"}
                    </Typography>
                  </Stack>

                  <Stack spacing={1}>
                    {group.options.map((option) => {
                      const active = group.selectionType === "single"
                        ? selected === option.id
                        : Array.isArray(selected) && selected.includes(option.id);
                      return (
                        <OptionButton
                          key={option.id}
                          active={active}
                          label={option.label}
                          priceDelta={option.priceDelta || 0}
                          onClick={() => {
                            setSelectionState((current) => {
                              if (group.selectionType === "single") {
                                return {
                                  ...current,
                                  [group.id]: option.id
                                };
                              }

                              const currentValues = Array.isArray(current[group.id]) ? current[group.id] : [];
                              const nextValues = currentValues.includes(option.id)
                                ? currentValues.filter((value) => value !== option.id)
                                : [...currentValues, option.id];
                              return {
                                ...current,
                                [group.id]: nextValues
                              };
                            });
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              );
            })}

            <TextField
              label="Special instructions"
              multiline
              minRows={3}
              placeholder="No onion, less spicy, serve extra hot..."
              value={specialInstructions}
              onChange={(event) => setSpecialInstructions(event.target.value)}
            />

            <Divider />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} justifyContent="space-between">
              <Typography variant="h6">Total {formatCurrency(total, currency)}</Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() =>
                  onAdd({
                    item,
                    quantity,
                    selectedCustomizations,
                    specialInstructions
                  })
                }
              >
                Add to cart
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
