import { Route, Routes } from "react-router-dom";
import { LoadingState } from "../components/common/LoadingState.jsx";
import { StatusBanner } from "../components/common/StatusBanner.jsx";
import { useAdminRealtime } from "../hooks/useAdminRealtime.js";
import { AdminLayout } from "../layouts/AdminLayout.jsx";
import { AnalyticsModule } from "../modules/analytics/AnalyticsModule.jsx";
import { MenuModule } from "../modules/menu/MenuModule.jsx";
import { OrdersModule } from "../modules/orders/OrdersModule.jsx";
import { OverviewModule } from "../modules/overview/OverviewModule.jsx";
import { SettingsModule } from "../modules/settings/SettingsModule.jsx";
import { StaffModule } from "../modules/staff/StaffModule.jsx";
import { TablesModule } from "../modules/tables/TablesModule.jsx";
import { useAdminWorkspace } from "../store/AdminWorkspaceContext.jsx";
import { useEffect } from "react";

export function WorkspacePage() {
  const { state, actions } = useAdminWorkspace();
  useAdminRealtime();

  useEffect(() => {
    actions.refreshWorkspace();
  }, []);

  if (state.loading && !state.restaurant) {
    return (
      <LoadingState message="We are connecting menu, floor, staff, and order intelligence into one operator workspace." />
    );
  }

  return (
    <AdminLayout
      restaurant={state.restaurant}
      title="Outlet command center"
      description="Modular admin architecture for restaurant management teams: operations, publishing, staffing, reporting, and brand control."
    >
      <div className="workspace-stack">
        {state.error ? <StatusBanner tone="error">{state.error}</StatusBanner> : null}
        {state.notice ? <StatusBanner>{state.notice}</StatusBanner> : null}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <OverviewModule
              restaurant={state.restaurant}
              orders={state.orders}
              tables={state.tables}
              items={state.items}
              staff={state.staff}
            />
          }
        />
        <Route
          path="/orders"
          element={<OrdersModule orders={state.orders} onUpdateStatus={actions.setOrderStatus} />}
        />
        <Route
          path="/menu"
          element={
            <MenuModule
              categories={state.categories}
              items={state.items}
              onCreateCategory={actions.createCategory}
              onCreateItem={actions.createMenuItem}
              onToggleAvailability={actions.toggleMenuAvailability}
            />
          }
        />
        <Route
          path="/tables"
          element={
            <TablesModule
              tables={state.tables}
              onCreateTable={actions.createTable}
              onUpdateStatus={actions.setTableStatus}
            />
          }
        />
        <Route
          path="/staff"
          element={<StaffModule staff={state.staff} onCreateStaff={actions.createStaff} />}
        />
        <Route
          path="/analytics"
          element={
            <AnalyticsModule
              restaurant={state.restaurant}
              orders={state.orders}
              tables={state.tables}
              items={state.items}
              staff={state.staff}
            />
          }
        />
        <Route
          path="/settings"
          element={<SettingsModule restaurant={state.restaurant} onSave={actions.saveRestaurantProfile} />}
        />
      </Routes>
    </AdminLayout>
  );
}
