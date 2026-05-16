import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import { loginKds, setStoredSession } from "../services/kdsApi.js";

const featureItems = [
  {
    icon: <DashboardCustomizeRoundedIcon fontSize="small" />,
    title: "Board first",
    text: "Compact lanes for TV and tablet kitchens."
  },
  {
    icon: <TableRestaurantRoundedIcon fontSize="small" />,
    title: "Seat aware",
    text: "See how many seats sent the same dish."
  },
  {
    icon: <SpeedRoundedIcon fontSize="small" />,
    title: "Rush friendly",
    text: "Fast actions with low-scroll workflows."
  }
];

export default function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({
    email: "chef@odine.test",
    password: "password123"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await loginKds(form);
      setStoredSession(session);
      onLogin(session);
    } catch (submitError) {
      setError(submitError.message || "Kitchen login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        px: 2,
        py: { xs: 2, md: 4 },
        display: "grid",
        placeItems: "center"
      }}
    >
      <Box
        sx={{
          width: "min(1180px, 100%)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
          gap: { xs: 2, md: 2.5 }
        }}
      >
        <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack spacing={3}>
              <Stack spacing={1.2}>
                <Box
                  sx={{
                    width: "fit-content",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.4,
                    py: 0.8,
                    borderRadius: 12,
                    bgcolor: "rgba(25,118,210,0.08)",
                    color: "primary.main"
                  }}
                >
                  <RestaurantRoundedIcon fontSize="small" />
                  <Typography variant="overline" sx={{ letterSpacing: 1.8, fontWeight: 800 }}>
                    ODINE KDS
                  </Typography>
                </Box>

                <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 56 }, lineHeight: 0.98 }}>
                  A chef cockpit built for dense order traffic, not for scrolling.
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 620, fontSize: { xs: 15, md: 16 } }}>
                  Track pending tickets, watch seat-level repetition, and push orders through with fewer taps on TV, tablet, or mobile.
                </Typography>
              </Stack>

              <Divider />

              <Box
                sx={{
                  display: "grid",
                  gap: 1.25,
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }
                }}
              >
                {featureItems.map((item) => (
                  <Card key={item.title} variant="outlined" sx={{ borderRadius: 3, minHeight: 128 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "rgba(25,118,210,0.08)",
                            color: "primary.main"
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
                            {item.text}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  bgcolor: "rgba(25,118,210,0.05)",
                  borderColor: "rgba(25,118,210,0.14)"
                }}
              >
                <CardContent sx={{ p: 2.25 }}>
                  <Stack direction="row" spacing={1.4} alignItems="center">
                    <LockRoundedIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Session protected
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Login persists locally and reconnects automatically.
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4, overflow: "hidden", alignSelf: "center" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.4 } }}>
            <Stack component="form" spacing={2.2} onSubmit={submit}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Kitchen login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to open the live board, batch view, and table frequency view.
              </Typography>

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Button type="submit" variant="contained" size="large" startIcon={<RestaurantRoundedIcon />} disabled={loading}>
                {loading ? "Opening board..." : "Open KDS"}
              </Button>

              <Divider />
              <Typography variant="caption" color="text.secondary">
                Use the same auth and socket flow already connected to your ODine backend.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
