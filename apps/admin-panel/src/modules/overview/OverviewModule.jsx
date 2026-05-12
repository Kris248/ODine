import { buildOrderInsights, buildOverviewMetrics, formatCurrency } from "../../models/adminMetrics.js";
import { MetricGrid } from "../../components/common/MetricGrid.jsx";

export function OverviewModule({ restaurant, orders, tables, items, staff }) {
  const metrics = buildOverviewMetrics({ orders, tables, items, staff });
  const insights = buildOrderInsights(orders);

  const metricItems = [
    {
      label: "Revenue",
      value: formatCurrency(metrics.revenue, restaurant?.settings?.currency || "INR"),
      caption: "Total value across current workspace orders"
    },
    {
      label: "Active Orders",
      value: metrics.activeOrders,
      caption: "Orders still moving across service and kitchen"
    },
    {
      label: "Occupied Tables",
      value: `${metrics.occupiedTables}/${tables.length || 0}`,
      caption: "Live floor usage snapshot"
    },
    {
      label: "Menu Availability",
      value: `${metrics.availableMenuItems}/${items.length || 0}`,
      caption: "Published items currently available"
    },
    {
      label: "Staff Access",
      value: metrics.totalStaff,
      caption: "Accounts with workspace access"
    }
  ];

  return (
    <div className="workspace-stack">
      <MetricGrid items={metricItems} />

      <section className="content-grid two-up">
        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Operational pulse</h3>
              <p>What the restaurant team needs to manage the floor right now.</p>
            </div>
          </div>
          <div className="insight-list">
            {Object.keys(insights.statusCounts).length === 0 ? (
              <p>No orders yet. Once live service starts, this panel will show load by status.</p>
            ) : (
              Object.entries(insights.statusCounts).map(([status, count]) => (
                <div className="line-item" key={status}>
                  <strong>{status}</strong>
                  <span>{count} orders</span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Top guest spenders</h3>
              <p>Useful for CRM, service recovery, and loyalty workflows.</p>
            </div>
          </div>
          <div className="insight-list">
            {insights.topGuests.length === 0 ? (
              <p>Guest order history will surface here once customer sessions begin.</p>
            ) : (
              insights.topGuests.map((guest) => (
                <div className="line-item" key={guest.guestName}>
                  <strong>{guest.guestName}</strong>
                  <span>{formatCurrency(guest.spend, restaurant?.settings?.currency || "INR")}</span>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
