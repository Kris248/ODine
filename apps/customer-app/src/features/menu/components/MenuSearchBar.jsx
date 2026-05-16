import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { InputAdornment, TextField } from "@mui/material";

export function MenuSearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search for skewers, bowls, cheesecakes..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <TuneRoundedIcon color="disabled" />
          </InputAdornment>
        )
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.82)"
        }
      }}
    />
  );
}
