import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { Box, Chip, Stack, Typography } from "@mui/material";

export function CategoryTabs({ categories = [], activeCategoryId = "", onSelectCategory }) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Quick categories
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 0.25,
          "&::-webkit-scrollbar": { height: 8 }
        }}
      >
        <Chip
          label="All dishes"
          icon={<RestaurantRoundedIcon />}
          color={!activeCategoryId ? "primary" : "default"}
          onClick={() => onSelectCategory("")}
          sx={{ flexShrink: 0 }}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            icon={category.featured ? <LocalFireDepartmentRoundedIcon /> : undefined}
            variant={activeCategoryId === category.id ? "filled" : "outlined"}
            color={activeCategoryId === category.id ? "primary" : "default"}
            onClick={() => onSelectCategory(category.id)}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </Box>
    </Stack>
  );
}
