import { ORDER_STATUSES } from "@odine/shared";

export function OrdersModule({ orders, onUpdateStatus }) {
  return (
    <section className="workspace-card">
      <div className="card-head">
        <div>
          <h3>Live order management</h3>
          <p>Track every ticket, coordinate kitchen progress, and intervene when service slips.</p>
        </div>
      </div>

      <div className="entity-list">
        {orders.length === 0 ? <p>No orders available yet.</p> : null}
        {orders.map((order) => (
          <article className="entity-row order-row" key={order._id || order.id}>
            <div className="entity-primary">
              <strong>Table {order.table?.label || order.tableId?.tableNumber}</strong>
              <p>{order.guestName || order.guestDetails?.name || "Guest"}</p>
              <p>{order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}</p>
            </div>
            <div className="entity-actions">
              <span className="pill">{order.fulfillmentStatus || order.status}</span>
              <div className="action-cluster">
                {ORDER_STATUSES.filter((status) => status !== "cancelled").map((status) => (
                  <button
                    key={status}
                    className="secondary-button"
                    disabled={status === (order.fulfillmentStatus || order.status)}
                    onClick={() => onUpdateStatus(order._id || order.id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
