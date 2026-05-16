import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

export function MenuSearchBar({
  value,
  onChange,
  placeholder = "Search dishes, ingredients, or flavour notes"
}) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.75 }}>
        Search the menu
      </Typography>
      <TextField
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange("")} aria-label="Clear search">
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
    </Box>
  );
}
