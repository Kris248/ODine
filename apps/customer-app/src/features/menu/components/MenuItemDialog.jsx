import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import {
  calculateCustomizationDelta,
  getDefaultSelectionState,
  resolveSelectedCustomizations
} from "../../../utils/cart.js";
import { formatCurrency, formatDietaryLabel, formatSpiceLabel } from "../../../utils/formatters.js";

export function MenuItemDialog({ open, item, currency, onClose, onConfirm }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectionState, setSelectionState] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    if (!item) {
      return;
    }

    setSelectionState(getDefaultSelectionState(item.customizationGroups || []));
    setQuantity(1);
    setSpecialInstructions("");
  }, [item]);

  const selectedCustomizations = useMemo(
    () => resolveSelectedCustomizations(item?.customizationGroups || [], selectionState),
    [item, selectionState]
  );
  const customizationDelta = useMemo(
    () => calculateCustomizationDelta(selectedCustomizations),
    [selectedCustomizations]
  );

  const isSelectionValid = (item?.customizationGroups || []).every((group) => {
    if (!group.required) {
      return true;
    }

    if (group.selectionType === "single") {
      return Boolean(selectionState[group.id]);
    }

    return (selectionState[group.id] || []).length > 0;
  });

  if (!item) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{item.name}</Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={formatDietaryLabel(item.dietaryType)} color="secondary" variant="outlined" />
            <Chip
              icon={<LocalFireDepartmentRoundedIcon sx={{ color: "inherit !important" }} />}
              label={formatSpiceLabel(item.spiceLevel)}
              sx={{ bgcolor: "rgba(250, 201, 132, 0.16)", color: "#93581d" }}
            />
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <Stack spacing={2.5}>
          <Box
            sx={{
              height: 230,
              borderRadius: 5,
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />

          <Typography color="text.secondary">{item.description}</Typography>
          <Typography variant="body2" color="text.secondary">
            {item.ingredients.join(" • ")}
          </Typography>

          {(item.customizationGroups || []).map((group) => (
            <Stack key={group.id} spacing={1.25}>
              <Typography variant="h6">
                {group.name}
                {group.required ? " *" : ""}
              </Typography>
              {group.selectionType === "single" ? (
                <RadioGroup
                  value={selectionState[group.id] || ""}
                  onChange={(event) =>
                    setSelectionState((current) => ({
                      ...current,
                      [group.id]: event.target.value
                    }))
                  }
                >
                  {group.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={`${option.label}${option.priceDelta ? ` (${formatCurrency(option.priceDelta, currency)})` : ""}`}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <FormGroup>
                  {group.options.map((option) => {
                    const currentValues = selectionState[group.id] || [];

                    return (
                      <FormControlLabel
                        key={option.id}
                        control={
                          <Checkbox
                            checked={currentValues.includes(option.id)}
                            onChange={(event) =>
                              setSelectionState((current) => ({
                                ...current,
                                [group.id]: event.target.checked
                                  ? [...(current[group.id] || []), option.id]
                                  : (current[group.id] || []).filter((value) => value !== option.id)
                              }))
                            }
                          />
                        }
                        label={`${option.label}${option.priceDelta ? ` (${formatCurrency(option.priceDelta, currency)})` : ""}`}
                      />
                    );
                  })}
                </FormGroup>
              )}
            </Stack>
          ))}

          <TextField
            label="Kitchen note"
            placeholder="Less oil, no onion, serve dessert later..."
            multiline
            minRows={3}
            value={specialInstructions}
            onChange={(event) => setSpecialInstructions(event.target.value)}
          />

          <Divider />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                aria-label="Decrease quantity"
              >
                <RemoveRoundedIcon />
              </IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity">
                <AddRoundedIcon />
              </IconButton>
            </Stack>
            <Button
              variant="contained"
              disabled={!isSelectionValid}
              onClick={() =>
                onConfirm({
                  item,
                  quantity,
                  selectedCustomizations,
                  specialInstructions
                })
              }
            >
              Add {formatCurrency((item.price + customizationDelta) * quantity, currency)}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
