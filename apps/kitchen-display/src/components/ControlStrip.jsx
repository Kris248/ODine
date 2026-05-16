import {
  Box,
  Chip,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  InputAdornment
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import ViewWeekRoundedIcon from "@mui/icons-material/ViewWeekRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

export default function ControlStrip({
  search,
  onSearchChange,
  activeView,
  onViewChange,
  activeFilter,
  onFilterChange,
  soundEnabled,
  onToggleSound,
  tableHints = []
}) {
  const filters = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "accepted", label: "Accepted" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "delayed", label: "Delayed" }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        p: { xs: 1.5, md: 2 },
        bgcolor: "rgba(255,255,255,0.78)",
        border: "1px solid rgba(35, 53, 45, 0.08)",
        backdropFilter: "blur(14px)"
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          alignItems={{ xs: "stretch", lg: "center" }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <TextField
              size="small"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search table, order, item, note..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <FormControlLabel
              control={<Switch checked={soundEnabled} onChange={(event) => onToggleSound(event.target.checked)} />}
              label={<Typography variant="body2">Sound</Typography>}
            />
            <Chip icon={<InsightsRoundedIcon />} label="Live focus" variant="outlined" />
          </Stack>
        </Stack>

        <Stack spacing={1.2}>
          <ToggleButtonGroup
            exclusive
            value={activeView}
            onChange={(_, next) => {
              if (next) onViewChange(next);
            }}
            size="small"
            sx={{
              flexWrap: "wrap",
              gap: 0.75,
              "& .MuiToggleButton-root": {
                borderRadius: 999,
                px: 1.6,
                py: 0.8,
                minHeight: 40
              }
            }}
          >
            <ToggleButton value="focus">
              <WidgetsRoundedIcon sx={{ mr: 0.9 }} fontSize="small" /> Focus
            </ToggleButton>
            <ToggleButton value="batch">
              <GridViewRoundedIcon sx={{ mr: 0.9 }} fontSize="small" /> Batch
            </ToggleButton>
            <ToggleButton value="tables">
              <TableRestaurantRoundedIcon sx={{ mr: 0.9 }} fontSize="small" /> Tables
            </ToggleButton>
            <ToggleButton value="timeline">
              <ViewWeekRoundedIcon sx={{ mr: 0.9 }} fontSize="small" /> Timeline
            </ToggleButton>
          </ToggleButtonGroup>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {filters.map((item) => (
              <Chip
                key={item.key}
                label={item.label}
                color={activeFilter === item.key ? "primary" : "default"}
                variant={activeFilter === item.key ? "filled" : "outlined"}
                onClick={() => onFilterChange(item.key)}
                sx={{ borderRadius: 999 }}
              />
            ))}
          </Stack>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
              Quick table search
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {tableHints.slice(0, 8).map((table) => (
                <Chip
                  key={table}
                  label={table}
                  variant="outlined"
                  onClick={() => onSearchChange(table)}
                  sx={{ borderRadius: 999 }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
