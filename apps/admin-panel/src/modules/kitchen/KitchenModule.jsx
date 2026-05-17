import { ORDER_STATUSES } from "@odine/shared";

const IN_FLIGHT_STATUSES = new Set(["pending", "placed", "accepted", "preparing", "ready"]);

function getOrderStatus(order) {
  return order.fulfillmentStatus || order.status || "pending";
}

function formatItems(order) {
  return (order.items || [])
    .map((item) => `${item.quantity || 1}× ${item.name}`)
    .join(", ");
}

export function KitchenModule({ orders, onUpdateStatus }) {
  const activeOrders = (orders || []).filter((order) => IN_FLIGHT_STATUSES.has(getOrderStatus(order)));
  const queued = activeOrders.filter((order) => ["pending", "placed", "accepted"].includes(getOrderStatus(order)));
  const cooking = activeOrders.filter((order) => getOrderStatus(order) === "preparing");
  const ready = activeOrders.filter((order) => getOrderStatus(order) === "ready");

  return (
    <div className="workspace-stack">
      <section className="content-grid three-up">
        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Queue</h3>
              <p>Tickets waiting to move into prep.</p>
            </div>
          </div>
          <strong className="stat-emphasis">{queued.length}</strong>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Cooking</h3>
              <p>Active prep orders in motion.</p>
            </div>
          </div>
          <strong className="stat-emphasis">{cooking.length}</strong>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Ready to serve</h3>
              <p>Completed prep waiting for handoff.</p>
            </div>
          </div>
          <strong className="stat-emphasis">{ready.length}</strong>
        </article>
      </section>

      <section className="workspace-card">
        <div className="card-head">
          <div>
            <h3>Kitchen display</h3>
            <p>Clean, high-contrast screen for chefs and expediter flow.</p>
          </div>
        </div>

        <div className="kitchen-grid">
          {activeOrders.length === 0 ? <p>No active kitchen tickets yet.</p> : null}
          {activeOrders.map((order) => {
            const status = getOrderStatus(order);
            const ticketId = order._id || order.id;

            return (
              <article className="kitchen-ticket" key={ticketId}>
                <div className="kitchen-ticket-head">
                  <div>
                    <p className="workspace-kicker">Table {order.table?.label || order.tableId?.tableNumber || "—"}</p>
                    <h4>{order.guestName || order.guestDetails?.name || "Guest"}</h4>
                  </div>
                  <span className="pill">{status}</span>
                </div>

                <p className="kitchen-ticket-items">{formatItems(order) || "No items found"}</p>

                {order.notes ? <p className="kitchen-ticket-notes">{order.notes}</p> : null}

                <div className="kitchen-ticket-actions">
                  {ORDER_STATUSES.filter((item) => item !== "cancelled").map((nextStatus) => (
                    <button
                      key={nextStatus}
                      type="button"
                      className={`secondary-button${nextStatus === status ? " is-selected" : ""}`}
                      disabled={nextStatus === status}
                      onClick={() => onUpdateStatus(ticketId, nextStatus)}
                    >
                      {nextStatus}
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
