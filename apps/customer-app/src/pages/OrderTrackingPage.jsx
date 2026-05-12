import { Link, useParams } from "react-router-dom";
import { ErrorScreen } from "../components/common/ErrorScreen.jsx";
import { LoadingScreen } from "../components/common/LoadingScreen.jsx";
import { formatCurrency, normalizeStatusLabel } from "../models/menu.js";
import { useOrderTracking } from "../hooks/useOrderTracking.js";

const STATUS_FLOW = ["received", "accepted", "preparing", "ready", "served"];

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const { loading, error, order } = useOrderTracking(orderId);

  if (loading) {
    return (
      <LoadingScreen
        title="Order in motion"
        body="We are syncing your order with the service team and kitchen board."
      />
    );
  }

  if (error || !order) {
    return <ErrorScreen title="Order unavailable" message={error || "This order could not be found."} />;
  }

  return (
    <div className="tracking-shell">
      <div className="tracking-card">
        <p className="kicker">Order confirmed</p>
        <h1>{normalizeStatusLabel(order.status)}</h1>
        <p className="tracking-body">
          Your request for Table {order.tableId?.tableNumber} has been routed to the team. Follow
          the dining progress below in real time.
        </p>
        <div className="timeline">
          {STATUS_FLOW.map((status) => {
            const currentIndex = STATUS_FLOW.indexOf(order.status);
            const statusIndex = STATUS_FLOW.indexOf(status);
            const state =
              statusIndex < currentIndex ? "done" : statusIndex === currentIndex ? "current" : "";

            return (
              <div className={`timeline-step ${state}`} key={status}>
                <span className="timeline-dot" />
                <strong>{normalizeStatusLabel(status)}</strong>
              </div>
            );
          })}
        </div>
        <div className="tracking-summary">
          <div className="bill-row">
            <span>Guest</span>
            <strong>{order.guestName}</strong>
          </div>
          <div className="bill-row">
            <span>Order total</span>
            <strong>{formatCurrency(order.total)}</strong>
          </div>
        </div>
        <Link className="text-link" to={`/table/${order.restaurantId}/${order.tableId?.tableNumber || order.tableId?._id || ""}`}>
          Return to menu
        </Link>
      </div>
    </div>
  );
}
