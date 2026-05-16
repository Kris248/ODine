import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import KitchenRoundedIcon from "@mui/icons-material/KitchenRounded";
import KdsSidebar from "./KdsSidebar.jsx";
import KdsTopBar from "./KdsTopBar.jsx";
import StatCard from "./StatCard.jsx";
import OrderStream from "./OrderStream.jsx";
import BatchBoard from "./BatchBoard.jsx";
import TableBoard from "./TableBoard.jsx";
import InsightsPanel from "./InsightsPanel.jsx";

export default function DashboardShell({
  orders,
  loading,
  error,
  session,
  soundEnabled,
  onSoundChange,
  activeView,
  onViewChange,
  activeFilter,
  onFilterChange,
  search,
  onSearchChange,
  onRefresh,
  onLogout,
  onStatusChange,
  updatingOrderId,
  tableHints,
  metrics,
  latestEvent,
  onClearEvent,
  statusCounts
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTabletDown = useMediaQuery(theme.breakpoints.down("lg"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setDrawerOpen(false);
  }, [isDesktop]);

  const content = useMemo(() => {
    if (activeView === "batch") return <BatchBoard orders={orders} />;
    if (activeView === "tables") return <TableBoard orders={orders} />;
    if (activeView === "alerts") return <InsightsPanel orders={orders} />;
    return <OrderStream orders={orders} onStatusChange={onStatusChange} updatingOrderId={updatingOrderId} />;
  }, [activeView, orders, onStatusChange, updatingOrderId]);

  const pinnedStats = (
    <Box
      sx={{
        display: "grid",
        gap: 1,
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(4, minmax(0, 1fr))"
        }
      }}
    >
      <StatCard
        label="Pending"
        value={metrics.waiting}
        sublabel="New + accepted + preparing"
        icon={<KitchenRoundedIcon fontSize="small" />}
        tone="primary"
      />
      <StatCard
        label="Delayed"
        value={metrics.delayed}
        sublabel="Over ETA"
        icon={<RefreshRoundedIcon fontSize="small" />}
        tone={metrics.delayed ? "warning" : "success"}
      />
      <StatCard
        label="Tables"
        value={metrics.uniqueTables}
        sublabel="Active tables"
        icon={<TableRestaurantRoundedIcon fontSize="small" />}
        tone="secondary"
      />
      <StatCard
        label="Ready"
        value={metrics.ready}
        sublabel="Done and waiting"
        icon={<LocalDiningRoundedIcon fontSize="small" />}
        tone="success"
      />
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: { xs: "1fr", lg: "292px minmax(0, 1fr)" }, overflow: "hidden" }}>
      <CssBaseline />

      <KdsSidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeView={activeView}
        onViewChange={onViewChange}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        statusCounts={statusCounts}
        soundEnabled={soundEnabled}
        onSoundChange={onSoundChange}
        metrics={metrics}
        tableHints={tableHints}
        onRefresh={onRefresh}
        onLogout={onLogout}
        session={session}
      />

      <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <KdsTopBar
          onMenuClick={() => setDrawerOpen(true)}
          soundEnabled={soundEnabled}
          onSoundChange={onSoundChange}
          onRefresh={onRefresh}
          session={session}
          metrics={metrics}
        />

        <Box
          sx={{
            px: { xs: 1.25, md: 2, xl: 2.5 },
            py: { xs: 1.25, md: 1.5 },
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            pb: { xs: 9, lg: 2 }
          }}
        >
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 1.25, md: 1.5 } }}>
              <Stack spacing={1.25}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1}
                  alignItems={{ xs: "stretch", md: "center" }}
                  justifyContent="space-between"
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 1.6, color: "text.secondary" }}>
                      {session?.user?.restaurantName || "Restaurant"}
                    </Typography>
                    <Typography variant="h3" sx={{ fontSize: { xs: 24, md: 34 }, lineHeight: 1.05 }}>
                      Ultra refined kitchen board.
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 780 }}>
                      Live queue, batch cooking, table frequency, and delayed focus in one low-scroll control surface.
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                    <Button variant="outlined" startIcon={soundEnabled ? <VolumeUpRoundedIcon /> : <VolumeOffRoundedIcon />} onClick={() => onSoundChange(!soundEnabled)}>
                      {soundEnabled ? "Sound on" : "Muted"}
                    </Button>
                    <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={onRefresh}>
                      Refresh
                    </Button>
                  </Stack>
                </Stack>

                {pinnedStats}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 1.25, md: 1.5 } }}>
              <Stack spacing={1.2}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", md: "center" }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                      Quick controls
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Filter by state or search by table, order, item, or note.
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: { xs: "100%", md: 360 } }}>
                    <Alert severity="info" sx={{ py: 0.5, borderRadius: 2 }}>
                      {loading ? "Loading live board..." : `${orders.length} tickets currently visible`}
                    </Alert>
                  </Box>
                </Stack>

                <Tabs
                  value={activeFilter}
                  onChange={(_, next) => onFilterChange(next)}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                >
                  <Tab value="all" label={`All (${statusCounts?.all ?? orders.length})`} />
                  <Tab value="new" label={`Pending (${statusCounts?.new ?? 0})`} />
                  <Tab value="accepted" label={`Accepted (${statusCounts?.accepted ?? 0})`} />
                  <Tab value="preparing" label={`Preparing (${statusCounts?.preparing ?? 0})`} />
                  <Tab value="ready" label={`Ready (${statusCounts?.ready ?? 0})`} />
                  <Tab value="served" label={`Served (${statusCounts?.served ?? 0})`} />
                  <Tab value="delayed" label={`Delayed (${statusCounts?.delayed ?? 0})`} />
                </Tabs>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "minmax(240px, 0.9fr) minmax(0, 1.1fr)" },
                    gap: 1
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Box
                      component="input"
                      value={search}
                      onChange={(event) => onSearchChange(event.target.value)}
                      placeholder="Search by order, table, seat, item, note..."
                      sx={{
                        width: "100%",
                        border: "1px solid rgba(16,24,40,0.12)",
                        borderRadius: 2,
                        px: 1.5,
                        py: 1.2,
                        outline: "none",
                        font: "inherit",
                        background: "#fff"
                      }}
                    />
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                    <Button variant={activeView === "live" ? "contained" : "outlined"} onClick={() => onViewChange("live")}>
                      Live
                    </Button>
                    <Button variant={activeView === "batch" ? "contained" : "outlined"} onClick={() => onViewChange("batch")}>
                      Batch
                    </Button>
                    <Button variant={activeView === "tables" ? "contained" : "outlined"} onClick={() => onViewChange("tables")}>
                      Tables
                    </Button>
                    <Button variant={activeView === "alerts" ? "contained" : "outlined"} onClick={() => onViewChange("alerts")}>
                      Alerts
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {error ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          ) : null}

          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "1fr",
                xl: "minmax(0, 1.55fr) minmax(340px, 0.75fr)"
              },
              flex: 1,
              minHeight: 0,
              overflow: "visible"
            }}
          >
            <Card sx={{ borderRadius: 3, minHeight: 0, overflow: "hidden" }}>
              <CardContent sx={{ p: { xs: 1.25, md: 1.5 }, height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  {content}
                </Box>
              </CardContent>
            </Card>

            <Box
              sx={{
                display: { xs: "none", xl: "flex" },
                flexDirection: "column",
                gap: 1.5,
                minHeight: 0
              }}
            >
              <InsightsPanel orders={orders} />
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Stack spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      Quick reference
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tap Pending, Accept, Preparing, Ready, or Served directly on each card.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use Batch view when the same dish floods in across multiple tables and seats.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use Tables view to see which tables repeat the most and how many seats are involved.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {!isTabletDown ? null : (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              p: 1,
              bgcolor: "rgba(255,255,255,0.9)",
              borderTop: "1px solid rgba(16,24,40,0.08)",
              backdropFilter: "blur(16px)",
              display: "flex",
              gap: 1,
              overflowX: "auto"
            }}
          >
            <Button variant={activeView === "live" ? "contained" : "outlined"} onClick={() => onViewChange("live")}>Live</Button>
            <Button variant={activeView === "batch" ? "contained" : "outlined"} onClick={() => onViewChange("batch")}>Batch</Button>
            <Button variant={activeView === "tables" ? "contained" : "outlined"} onClick={() => onViewChange("tables")}>Tables</Button>
            <Button variant={activeView === "alerts" ? "contained" : "outlined"} onClick={() => onViewChange("alerts")}>Alerts</Button>
          </Box>
        )}

        <Snackbar
          open={Boolean(latestEvent)}
          autoHideDuration={3500}
          onClose={onClearEvent}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          {latestEvent ? (
            <Alert onClose={onClearEvent} severity={latestEvent.type === "new" ? "success" : "info"} variant="filled" sx={{ width: "100%" }}>
              <strong>{latestEvent.title}</strong> — {latestEvent.message}
            </Alert>
          ) : null}
        </Snackbar>
      </Box>
    </Box>
  );
}
