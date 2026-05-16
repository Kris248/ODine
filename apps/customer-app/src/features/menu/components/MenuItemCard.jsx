import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { formatCurrency, formatDietaryLabel, formatSpiceLabel } from "../../../utils/formatters.js";

export function MenuItemCard({ item, currency, onOpenDetails, onQuickAdd }) {
  const hasCustomizations = item.customizationGroups?.length > 0;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        overflow: "hidden",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6
        }
      }}
    >
      <Box
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetails(item)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenDetails(item);
          }
        }}
        sx={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            height: 180,
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </Box>
      <CardContent sx={{ p: 2, pt: 2.5 }}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              size="small"
              label={formatDietaryLabel(item.dietaryType)}
              sx={{
                bgcolor: item.dietaryType === "veg" ? "rgba(111, 128, 96, 0.12)" : "rgba(155, 91, 61, 0.12)",
                color: item.dietaryType === "veg" ? "secondary.dark" : "primary.dark"
              }}
            />
            <Chip
              size="small"
              icon={<LocalFireDepartmentRoundedIcon sx={{ fontSize: 16, color: "inherit !important" }} />}
              label={formatSpiceLabel(item.spiceLevel)}
              sx={{ bgcolor: "rgba(250, 201, 132, 0.18)", color: "#93581d" }}
            />
            {item.bestseller ? (
              <Chip
                size="small"
                icon={<StarRoundedIcon sx={{ fontSize: 16, color: "inherit !important" }} />}
                label="Bestseller"
                sx={{ bgcolor: "rgba(243, 211, 137, 0.2)", color: "#7f5a10" }}
              />
            ) : null}
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography color="text.secondary" noWrap>
              {item.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {item.ingredients.join(" • ")}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Box>
              <Typography variant="subtitle1">{formatCurrency(item.price, currency)}</Typography>
              <Typography variant="caption" color="text.secondary">
                {hasCustomizations ? "Customize to add" : "Quick add"}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => onOpenDetails(item)}>
                Details
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<RestaurantRoundedIcon />}
                onClick={() => (hasCustomizations ? onOpenDetails(item) : onQuickAdd(item))}
              >
                {hasCustomizations ? "Customize" : "Add"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
