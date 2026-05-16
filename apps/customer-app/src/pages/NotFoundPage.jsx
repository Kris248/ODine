import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES, DEFAULT_RESTAURANT_ID, DEFAULT_TABLE_ID } from "../constants/routes.js";
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <CustomerLayout>
      <Stack sx={{ minHeight: "72vh", alignItems: "center", justifyContent: "center" }}>
        <Card sx={{ width: "100%", maxWidth: 680 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h2" sx={{ fontSize: { xs: 50, sm: 64 } }}>
                404
              </Typography>
              <Typography variant="h5">Page not found</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 520, lineHeight: 1.7 }}>
                The route you opened does not exist. Go back to the menu and continue the table ordering flow.
              </Typography>
              <Button
                variant="contained"
                startIcon={<HomeRoundedIcon />}
                onClick={() => navigate(APP_ROUTES.home(DEFAULT_RESTAURANT_ID, DEFAULT_TABLE_ID))}
              >
                Back to menu
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </CustomerLayout>
  );
}
