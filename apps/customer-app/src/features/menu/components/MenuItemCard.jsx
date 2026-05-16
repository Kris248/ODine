import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { Box, Button, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import { formatCurrency, formatDietaryLabel, formatSpiceLabel } from "../../../utils/formatters.js";

export function MenuItemCard({ item, currency = "INR", onOpen, onQuickAdd }) {
  if (!item) return null;

  const tags = [
    formatDietaryLabel(item.dietaryType),
    item.spiceLevel ? formatSpiceLabel(item.spiceLevel) : null,
    item.bestseller ? "Chef favourite" : null
  ].filter(Boolean);

  return (
    <Card
      onClick={onOpen}
      sx={{
        height: "100%",
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          transform: { xs: "none", md: "translateY(-2px)" },
          boxShadow: "0 18px 36px rgba(24,34,48,0.08)"
        }
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{
            width: "100%",
            aspectRatio: "1.08 / 1",
            objectFit: "cover",
            backgroundColor: "rgba(15,118,110,0.04)"
          }}
        />
        <Chip
          size="small"
          label={formatDietaryLabel(item.dietaryType)}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(255,255,255,0.7)"
          }}
        />
      </Box>

      <CardContent sx={{ p: 1.75 }}>
        <Stack spacing={1.1}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.25}>
            <Stack spacing={0.35} sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={850} noWrap>
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }} noWrap={false}>
                {item.description}
              </Typography>
            </Stack>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onQuickAdd?.();
              }}
              sx={{
                bgcolor: "rgba(15,118,110,0.08)",
                border: "1px solid rgba(15,118,110,0.12)"
              }}
              aria-label={`Add ${item.name}`}
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            {tags.slice(0, 2).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
            {item.bestseller ? (
              <Chip
                icon={<LocalFireDepartmentRoundedIcon sx={{ fontSize: 16 }} />}
                label="Popular"
                size="small"
                color="secondary"
                variant="outlined"
              />
            ) : null}
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
            <Typography variant="h6" sx={{ fontSize: 20 }}>
              {formatCurrency(item.price, currency)}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RestaurantRoundedIcon />}
              onClick={(event) => {
                event.stopPropagation();
                onOpen?.();
              }}
            >
              Details
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
