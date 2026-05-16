import { Navigate, Route, Routes } from "react-router-dom";
import { DEFAULT_RESTAURANT_ID, DEFAULT_TABLE_ID, APP_ROUTES } from "../constants/routes.js";
import { CartPage } from "../pages/CartPage.jsx";
import { CheckoutPage } from "../pages/CheckoutPage.jsx";
import { ConfirmationPage } from "../pages/ConfirmationPage.jsx";
import { MenuPage } from "../pages/MenuPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";
import { OrderTrackingPage } from "../pages/OrderTrackingPage.jsx";
import { PaymentPage } from "../pages/PaymentPage.jsx";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={APP_ROUTES.home(DEFAULT_RESTAURANT_ID, DEFAULT_TABLE_ID)} replace />}
      />
      <Route path="/table/:restaurantId/:tableId" element={<MenuPage />} />
      <Route path="/table/:restaurantId/:tableId/cart" element={<CartPage />} />
      <Route path="/table/:restaurantId/:tableId/checkout" element={<CheckoutPage />} />
      <Route path="/table/:restaurantId/:tableId/payment" element={<PaymentPage />} />
      <Route path="/table/:restaurantId/:tableId/orders/:orderId" element={<OrderTrackingPage />} />
      <Route
        path="/table/:restaurantId/:tableId/confirmation/:orderId"
        element={<ConfirmationPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
