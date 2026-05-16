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
    item.bestseller ? "Bestseller" : null
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
          boxShadow: "0 18px 40px rgba(17, 24, 39, 0.09)"
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
            aspectRatio: "4 / 3",
            objectFit: "cover",
            backgroundColor: "rgba(226,55,68,0.06)"
          }}
        />
        <Stack
          direction="row"
          spacing={0.75}
          useFlexGap
          flexWrap="wrap"
          sx={{ position: "absolute", left: 12, top: 12, right: 12 }}
        >
          {item.bestseller ? (
            <Chip
              icon={<LocalFireDepartmentRoundedIcon sx={{ fontSize: 16 }} />}
              label="Top pick"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.94)" }}
            />
          ) : null}
          <Chip
            label={formatDietaryLabel(item.dietaryType)}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.94)" }}
          />
        </Stack>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            onQuickAdd?.();
          }}
          aria-label={`Add ${item.name}`}
          sx={{
            position: "absolute",
            right: 12,
            bottom: 12,
            bgcolor: "rgba(255,255,255,0.95)",
            boxShadow: "0 10px 26px rgba(17,24,39,0.12)",
            "&:hover": { bgcolor: "#fff" }
          }}
        >
          <AddRoundedIcon />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.25}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.15 }}>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ minHeight: 38 }}>
              {item.description}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            {tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Starting at
              </Typography>
              <Typography variant="h6" color="primary.main" sx={{ lineHeight: 1.1 }}>
                {formatCurrency(item.price, currency)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<RestaurantRoundedIcon />}
              onClick={(event) => {
                event.stopPropagation();
                onQuickAdd?.();
              }}
              sx={{ minWidth: 110 }}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
