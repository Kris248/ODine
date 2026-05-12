import { FormSection } from "../../components/common/FormSection.jsx";

export function StaffModule({ staff, onCreateStaff }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateStaff({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role")
    });
    event.currentTarget.reset();
  }

  return (
    <div className="workspace-stack">
      <section className="content-grid two-up">
        <FormSection
          title="Access control"
          description="Management teams need controlled staff creation, role assignment, and audit-ready access boundaries."
        >
          <form className="form-stack" onSubmit={handleSubmit}>
            <input name="name" placeholder="Full name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Temporary password" required />
            <select name="role" defaultValue="manager">
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
            </select>
            <button className="primary-button" type="submit">
              Create staff account
            </button>
          </form>
        </FormSection>

        <article className="workspace-card">
          <div className="card-head">
            <div>
              <h3>Enterprise admin checklist</h3>
              <p>These are the management capabilities clients expect from a deployable admin console.</p>
            </div>
          </div>
          <div className="insight-list">
            <div className="line-item">
              <strong>Role-based access</strong>
              <span>Owner, manager, and chef in current MVP</span>
            </div>
            <div className="line-item">
              <strong>Activity trail</strong>
              <span>Planned next for compliance and accountability</span>
            </div>
            <div className="line-item">
              <strong>Shift workflows</strong>
              <span>Planned next for attendance and handover</span>
            </div>
          </div>
        </article>
      </section>

      <section className="workspace-card">
        <div className="card-head">
          <div>
            <h3>Staff registry</h3>
            <p>Directory of accounts that can access outlet operations.</p>
          </div>
        </div>
        <div className="entity-list">
          {staff.map((member) => (
            <article className="entity-row" key={member._id}>
              <div className="entity-primary">
                <strong>{member.name}</strong>
                <p>{member.email}</p>
              </div>
              <div className="entity-actions">
                <span className="pill">{member.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
