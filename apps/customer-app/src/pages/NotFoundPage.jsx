import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { APP_ROUTES, DEFAULT_RESTAURANT_ID, DEFAULT_TABLE_ID } from "../constants/routes.js";
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <CustomerLayout>
      <EmptyState
        title="That table link does not exist"
        description="The QR route may have expired, or the table has not been assigned yet."
        actionLabel="Open demo table"
        onAction={() => navigate(APP_ROUTES.home(DEFAULT_RESTAURANT_ID, DEFAULT_TABLE_ID))}
        icon={<SearchOffRoundedIcon sx={{ fontSize: 34 }} />}
      />
    </CustomerLayout>
  );
}
