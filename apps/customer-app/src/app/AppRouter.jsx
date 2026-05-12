import { Route, Routes } from "react-router-dom";
import { CartProvider } from "../store/CartContext.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";
import { OrderTrackingPage } from "../pages/OrderTrackingPage.jsx";
import { TableExperiencePage } from "../pages/TableExperiencePage.jsx";

export function AppRouter() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/table/:restaurantId/:tableId" element={<TableExperiencePage />} />
        <Route path="/order/:orderId" element={<OrderTrackingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </CartProvider>
  );
}
