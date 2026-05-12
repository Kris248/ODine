import { buildOrderInsights, buildOverviewMetrics, formatCurrency } from "../../models/adminMetrics.js";

export function AnalyticsModule({ restaurant, orders, tables, items, staff }) {
  const metrics = buildOverviewMetrics({ orders, tables, items, staff });
  const insights = buildOrderInsights(orders);

  return (
    <div className="workspace-stack">
      <section className="content-grid three-up">
        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Revenue summary</h3>
              <p>Current order value in this workspace.</p>
            </div>
          </div>
          <strong className="stat-emphasis">
            {formatCurrency(metrics.revenue, restaurant?.settings?.currency || "INR")}
          </strong>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Throughput</h3>
              <p>Orders handled in the active dataset.</p>
            </div>
          </div>
          <strong className="stat-emphasis">{orders.length}</strong>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Utilization</h3>
              <p>Tables currently in use.</p>
            </div>
          </div>
          <strong className="stat-emphasis">{`${metrics.occupiedTables}/${tables.length || 0}`}</strong>
        </article>
      </section>

      <section className="content-grid two-up">
        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Status distribution</h3>
              <p>Basic operational analytics managers rely on throughout service.</p>
            </div>
          </div>
          <div className="insight-list">
            {Object.entries(insights.statusCounts).map(([status, count]) => (
              <div className="line-item" key={status}>
                <strong>{status}</strong>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Architecture roadmap</h3>
              <p>What large restaurant operators typically want next.</p>
            </div>
          </div>
          <div className="insight-list">
            <div className="line-item">
              <strong>Hourly sales curves</strong>
              <span>Peak time staffing decisions</span>
            </div>
            <div className="line-item">
              <strong>Dish contribution margins</strong>
              <span>Menu engineering</span>
            </div>
            <div className="line-item">
              <strong>Cancellation patterns</strong>
              <span>Operational loss prevention</span>
            </div>
            <div className="line-item">
              <strong>Repeat guest cohorts</strong>
              <span>CRM and loyalty strategy</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
