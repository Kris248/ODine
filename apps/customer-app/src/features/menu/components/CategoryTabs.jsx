import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

export function CategoryTabs({ categories, activeCategoryId, onSelectCategory }) {
  return (
    <Stack spacing={1}>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <FormControl fullWidth size="small">
          <InputLabel>Menu section</InputLabel>
          <Select
            value={activeCategoryId}
            label="Menu section"
            onChange={(event) => onSelectCategory(event.target.value)}
          >
            <MenuItem value="">All dishes</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5, display: { xs: "none", md: "flex" } }}>
        <Chip
          label="All dishes"
          clickable
          color={!activeCategoryId ? "primary" : "default"}
          onClick={() => onSelectCategory("")}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            clickable
            color={activeCategoryId === category.id ? "primary" : "default"}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
