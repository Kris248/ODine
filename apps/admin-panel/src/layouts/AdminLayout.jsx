import { NavLink } from "react-router-dom";
import { useSession } from "../store/SessionContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Overview", end: true },
  { to: "/orders", label: "Orders" },
  { to: "/menu", label: "Menu" },
  { to: "/tables", label: "Tables" },
  { to: "/staff", label: "Staff" },
  { to: "/analytics", label: "Analytics" },
  { to: "/settings", label: "Settings" }
];

export function AdminLayout({ restaurant, title, description, children }) {
  const { session, logout } = useSession();

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="brand-block">
          <p className="workspace-kicker">ODine Ops</p>
          <h2>{restaurant?.name || "Restaurant Workspace"}</h2>
          <p>{session?.user?.name}</p>
        </div>

        <nav className="workspace-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "workspace-link active" : "workspace-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-note">
          <p>Built for restaurant management teams: operations, menu control, staff, and live floor visibility.</p>
          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-header">
          <div>
            <p className="workspace-kicker">Management Console</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
