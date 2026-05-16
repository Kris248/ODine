import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { IconButton, InputAdornment, TextField } from "@mui/material";

export function MenuSearchBar({ value, onChange, placeholder = "Search dishes, ingredients, or categories" }) {
  return (
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
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: "#fff"
        }
      }}
    />
  );
}
