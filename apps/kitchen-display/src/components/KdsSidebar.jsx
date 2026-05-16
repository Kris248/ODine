import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";

const VIEW_ITEMS = [
  { key: "live", label: "Live board", icon: <DashboardRoundedIcon fontSize="small" />, helper: "Fast queue" },
  { key: "batch", label: "Batch cook", icon: <GridViewRoundedIcon fontSize="small" />, helper: "Grouped dishes" },
  { key: "tables", label: "Tables", icon: <TableRestaurantRoundedIcon fontSize="small" />, helper: "Seat frequency" },
  { key: "alerts", label: "Alerts", icon: <WarningAmberRoundedIcon fontSize="small" />, helper: "Delayed focus" }
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "new", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" },
  { key: "delayed", label: "Delayed" }
];

export default function KdsSidebar({
  open,
  onClose,
  activeView,
  onViewChange,
  activeFilter,
  onFilterChange,
  statusCounts,
  soundEnabled,
  onSoundChange,
  metrics,
  tableHints = [],
  onRefresh,
  onLogout,
  session,
  width = 292
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const countFor = (key) => {
    if (statusCounts?.[key] !== undefined) return statusCounts[key];
    if (key === "all") return metrics.total;
    if (key === "new") return metrics.waiting;
    if (key === "ready") return metrics.ready;
    if (key === "delayed") return metrics.delayed;
    return 0;
  };

  const content = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 1.8, color: "text.secondary" }}>
            ODINE KDS
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.05, mt: 0.3 }}>
            Chef command center
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            One screen for live tickets, batch cooking, and table frequency.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip label={`${metrics.total} live`} color="primary" />
          <Chip label={`${metrics.delayed} delayed`} color={metrics.delayed ? "warning" : "default"} />
          <Chip label={`${metrics.uniqueTables} tables`} variant="outlined" />
        </Stack>

        <Divider />
      </Stack>

      <Stack spacing={0.6} sx={{ mt: 1 }}>
        {VIEW_ITEMS.map((item) => (
          <ListItemButton
            key={item.key}
            selected={activeView === item.key}
            onClick={() => {
              onViewChange(item.key);
              if (!isDesktop) onClose?.();
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              alignItems: "flex-start"
            }}
          >
            <ListItemIcon sx={{ minWidth: 34, mt: 0.2, color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 800 }}>{item.label}</Typography>}
              secondary={<Typography variant="caption" color="text.secondary">{item.helper}</Typography>}
            />
          </ListItemButton>
        ))}
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.8 }}>
        Order states
      </Typography>

      <Stack spacing={0.6}>
        {FILTERS.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "contained" : "outlined"}
            color={filter.key === "delayed" ? "warning" : activeFilter === filter.key ? "primary" : "inherit"}
            onClick={() => {
              onFilterChange(filter.key);
              if (!isDesktop) onClose?.();
            }}
            sx={{ justifyContent: "space-between", px: 1.5 }}
            endIcon={
              <Box
                sx={{
                  minWidth: 24,
                  height: 24,
                  px: 0.8,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: activeFilter === filter.key ? "rgba(255,255,255,0.18)" : "rgba(16,24,40,0.06)"
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800 }}>
                  {countFor(filter.key)}
                </Typography>
              </Box>
            }
          >
            {filter.label}
          </Button>
        ))}
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      <Stack spacing={1.2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Sound
          </Typography>
          <Switch checked={soundEnabled} onChange={(event) => onSoundChange(event.target.checked)} />
        </Stack>

        <Button startIcon={<NotificationsActiveRoundedIcon />} variant="outlined" onClick={onRefresh}>
          Refresh live orders
        </Button>
        <Button startIcon={<LogoutRoundedIcon />} color="inherit" variant="outlined" onClick={onLogout}>
          Logout
        </Button>
      </Stack>

      <Box sx={{ mt: "auto", pt: 2 }}>
        <Divider sx={{ mb: 1.5 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          {session?.user?.restaurantName || "Restaurant"}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          Hot tables
        </Typography>
        <Stack spacing={0.75} sx={{ mt: 1 }}>
          {tableHints.slice(0, 5).map((table) => (
            <Box key={table} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                {table}
              </Typography>
              <Chip size="small" label="Live" variant="outlined" />
            </Box>
          ))}
          {tableHints.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Waiting for live tables.
            </Typography>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isDesktop ? "permanent" : "temporary"}
      open={isDesktop ? true : open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(16,24,40,0.08)",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px)"
        }
      }}
    >
      {content}
    </Drawer>
  );
}
