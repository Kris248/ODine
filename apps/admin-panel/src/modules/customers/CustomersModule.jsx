function getCustomerKey(order, index) {
  return (
    order.customer?.email ||
    order.guestDetails?.email ||
    order.guestEmail ||
    order.guestDetails?.phone ||
    order.guestName ||
    `guest-${index}`
  );
}

function getCustomerName(order) {
  return (
    order.customer?.name ||
    order.guestDetails?.name ||
    order.guestName ||
    "Guest"
  );
}

function getOrderTotal(order) {
  return Number(
    order.totalAmount ??
      order.total ??
      order.billAmount ??
      order.amount ??
      order.subtotal ??
      0
  );
}

function buildCustomerCards(orders) {
  const map = new Map();

  (orders || []).forEach((order, index) => {
    const key = getCustomerKey(order, index);
    const total = getOrderTotal(order);

    if (!map.has(key)) {
      map.set(key, {
        key,
        name: getCustomerName(order),
        email: order.customer?.email || order.guestDetails?.email || order.guestEmail || "",
        phone: order.guestDetails?.phone || order.guestPhone || "",
        visits: 0,
        totalSpend: 0,
        lastTable: order.table?.label || order.tableId?.tableNumber || "—",
        lastStatus: order.fulfillmentStatus || order.status || "pending"
      });
    }

    const entry = map.get(key);
    entry.visits += 1;
    entry.totalSpend += total;
    entry.lastTable = order.table?.label || order.tableId?.tableNumber || entry.lastTable;
    entry.lastStatus = order.fulfillmentStatus || order.status || entry.lastStatus;
  });

  return [...map.values()].sort((a, b) => b.visits - a.visits || b.totalSpend - a.totalSpend);
}

export function CustomersModule({ orders, restaurant }) {
  const customers = buildCustomerCards(orders);
  const repeatGuests = customers.filter((customer) => customer.visits > 1).length;
  const capturedContacts = customers.filter((customer) => customer.email || customer.phone).length;
  const averageSpend =
    customers.length === 0
      ? 0
      : customers.reduce((sum, customer) => sum + customer.totalSpend, 0) / customers.length;

  return (
    <div className="workspace-stack">
      <section className="content-grid four-up">
        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Guests tracked</h3>
              <p>Unique customer profiles captured.</p>
            </div>
          </div>
          <strong className="stat-emphasis">{customers.length}</strong>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Repeat guests</h3>
              <p>Customers with more than one visit.</p>
            </div>
          </div>
          <strong className="stat-emphasis">{repeatGuests}</strong>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Contacts captured</h3>
              <p>Profiles with email or phone data.</p>
            </div>
          </div>
          <strong className="stat-emphasis">{capturedContacts}</strong>
        </article>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Avg spend</h3>
              <p>Average spend across guest profiles.</p>
            </div>
          </div>
          <strong className="stat-emphasis">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: restaurant?.settings?.currency || "INR",
              maximumFractionDigits: 0
            }).format(averageSpend)}
          </strong>
        </article>
      </section>

      <section className="workspace-card">
        <div className="card-head">
          <div>
            <h3>Customer intelligence</h3>
            <p>Guest patterns derived from tracked dine-in orders.</p>
          </div>
        </div>

        <div className="customer-grid">
          {customers.length === 0 ? <p>No guest profiles yet. Captured emails and repeat visits will show here.</p> : null}
          {customers.map((customer) => (
            <article className="customer-card" key={customer.key}>
              <div className="customer-card-head">
                <div>
                  <h4>{customer.name}</h4>
                  <p>{customer.email || customer.phone || "No contact captured"}</p>
                </div>
                <span className="pill soft">{customer.visits} visit{customer.visits > 1 ? "s" : ""}</span>
              </div>

              <div className="customer-card-meta">
                <div>
                  <span>Last table</span>
                  <strong>{customer.lastTable}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{customer.lastStatus}</strong>
                </div>
                <div>
                  <span>Total spend</span>
                  <strong>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: restaurant?.settings?.currency || "INR",
                      maximumFractionDigits: 0
                    }).format(customer.totalSpend)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
