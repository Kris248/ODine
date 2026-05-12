import { FormSection } from "../../components/common/FormSection.jsx";

export function TablesModule({ tables, onCreateTable, onUpdateStatus }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateTable({ tableNumber: formData.get("tableNumber") });
    event.currentTarget.reset();
  }

  return (
    <div className="workspace-stack">
      <section className="content-grid two-up">
        <FormSection
          title="Table provisioning"
          description="Add a new dining table, issue QR routing, and prepare it for service."
        >
          <form className="form-stack" onSubmit={handleSubmit}>
            <input name="tableNumber" placeholder="Table number" required />
            <button className="primary-button" type="submit">
              Create table
            </button>
          </form>
        </FormSection>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>What operations teams need</h3>
              <p>Table-level readiness, QR distribution, occupancy state, and clean floor visibility.</p>
            </div>
          </div>
          <div className="insight-list">
            <div className="line-item">
              <strong>QR routing</strong>
              <span>Downloadable per table</span>
            </div>
            <div className="line-item">
              <strong>Status control</strong>
              <span>Empty or occupied in current MVP</span>
            </div>
            <div className="line-item">
              <strong>Future-ready</strong>
              <span>Can expand to reservation and merge workflows</span>
            </div>
          </div>
        </article>
      </section>

      <section className="workspace-card">
        <div className="card-head">
          <div>
            <h3>Table directory</h3>
            <p>Central place for floor mapping, occupancy updates, and QR exports.</p>
          </div>
        </div>
        <div className="entity-list">
          {tables.map((table) => (
            <article className="entity-row" key={table._id}>
              <div className="entity-primary">
                <strong>Table {table.tableNumber}</strong>
                <p>{table.status}</p>
              </div>
              <div className="entity-actions">
                <a className="secondary-link" href={table.qrCodeUrl} download={`table-${table.tableNumber}.png`}>
                  Download QR
                </a>
                <button className="secondary-button" onClick={() => onUpdateStatus(table._id, "empty")}>
                  Mark empty
                </button>
                <button className="secondary-button" onClick={() => onUpdateStatus(table._id, "occupied")}>
                  Mark occupied
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
