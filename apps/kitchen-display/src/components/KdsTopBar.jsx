import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

export default function KdsTopBar({
  onMenuClick,
  soundEnabled,
  onSoundChange,
  onRefresh,
  session,
  metrics
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar sx={{ px: { xs: 1.25, md: 2 }, minHeight: { xs: 72, md: 78 }, gap: 1.2 }}>
        {!isDesktop ? (
          <IconButton edge="start" onClick={onMenuClick}>
            <MenuRoundedIcon />
          </IconButton>
        ) : null}

        <Stack spacing={0.2} sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>
            ODine KDS
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {session?.user?.restaurantName || "Restaurant"} • live kitchen board
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Chip size="small" color="primary" label={`${metrics.total} live`} />
          <Chip size="small" color={metrics.delayed ? "warning" : "default"} label={`${metrics.delayed} delayed`} />
          <Chip size="small" variant="outlined" label={`${metrics.ready} ready`} />
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={onRefresh}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={() => onSoundChange(!soundEnabled)}
            startIcon={soundEnabled ? <VolumeUpRoundedIcon /> : <VolumeOffRoundedIcon />}
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          >
            {soundEnabled ? "Sound on" : "Muted"}
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
