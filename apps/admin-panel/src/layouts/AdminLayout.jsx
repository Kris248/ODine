import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "../store/SessionContext.jsx";
import { ADMIN_NAV_GROUPS } from "../config/adminNavigation.jsx";

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

function matchesRoute(pathname, route) {
  const path = normalizePath(pathname);
  const to = normalizePath(route);
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

function NavIcon({ name }) {
  switch (name) {
    case "orders":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5h14v2H5zm0 6h14v2H5zm0 6h10v2H5z" />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
        </svg>
      );
    case "tables":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h16v4H4zm2 6h4v8H6zm8 0h4v8h-4z" />
        </svg>
      );
    case "staff":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0z" />
        </svg>
      );
    case "kitchen":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 4h2v6H6zm4 0h2v6h-2zm4 0h2v6h-2zm-10 9h12v7H4z" />
        </svg>
      );
    case "customers":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm-8 8a8 8 0 0 1 16 0z" />
        </svg>
      );
    case "analytics":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 19h14v2H3V3h2zm3-2V9h2v8zm4 0V5h2v12zm4 0v-6h2v6z" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.14 12.94a7.5 7.5 0 0 0 0-1.88l2-1.55a.5.5 0 0 0 .12-.63l-1.9-3.29a.5.5 0 0 0-.6-.22l-2.35.95a7.3 7.3 0 0 0-1.62-.94l-.36-2.49A.5.5 0 0 0 14.03 2h-4.06a.5.5 0 0 0-.49.42l-.36 2.49a7.3 7.3 0 0 0-1.62.94l-2.35-.95a.5.5 0 0 0-.6.22l-1.9 3.29a.5.5 0 0 0 .12.63l2 1.55a7.5 7.5 0 0 0 0 1.88l-2 1.55a.5.5 0 0 0-.12.63l1.9 3.29a.5.5 0 0 0 .6.22l2.35-.95c.5.37 1.05.69 1.62.94l.36 2.49a.5.5 0 0 0 .49.42h4.06a.5.5 0 0 0 .49-.42l.36-2.49c.57-.25 1.12-.57 1.62-.94l2.35.95a.5.5 0 0 0 .6-.22l1.9-3.29a.5.5 0 0 0-.12-.63zM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5z" />
        </svg>
      );
    case "overview":
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h7v7H4zm9 0h7v4h-7zm0 6h7v8h-7zM4 14h7v5H4z" />
        </svg>
      );
  }
}

export function AdminLayout({ restaurant, children }) {
  const { session, logout } = useSession();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 980px)");
    const apply = () => {
      setIsMobile(media.matches);
      if (!media.matches) {
        setMobileOpen(false);
      }
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    document.body.classList.toggle("workspace-lock-scroll", mobileOpen && isMobile);
    return () => document.body.classList.remove("workspace-lock-scroll");
  }, [mobileOpen, isMobile]);

  const currentPage = useMemo(() => {
    const pathname = normalizePath(location.pathname);
    const flatItems = ADMIN_NAV_GROUPS.flatMap((group) => group.items);
    return (
      flatItems.find((item) => matchesRoute(pathname, item.to)) ||
      flatItems[0] ||
      null
    );
  }, [location.pathname]);

  const brandInitials = useMemo(() => {
    const name = restaurant?.name || "ODine";
    return name
      .split(" ")
      .map((part) => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [restaurant?.name]);

  const shellClass = [
    "workspace-shell",
    collapsed ? "is-collapsed" : "",
    mobileOpen ? "is-sidebar-open" : "",
    isMobile ? "is-mobile" : "is-desktop"
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClass}>
      {isMobile ? (
        <button
          type="button"
          className="workspace-fab"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      ) : null}

      {isMobile ? (
        <button
          type="button"
          className={`workspace-overlay ${mobileOpen ? "is-visible" : ""}`}
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          tabIndex={mobileOpen ? 0 : -1}
        />
      ) : null}

      <aside className="workspace-sidebar">
        <div className="workspace-sidebar-top">
          <div className="workspace-brand">
            <div className="workspace-brand-mark">{brandInitials}</div>
            <div className="workspace-brand-copy">
              <p className="workspace-kicker">ODine CRM</p>
              <h2>{restaurant?.name || "Restaurant Workspace"}</h2>
              <p>{restaurant?.slug || session?.user?.email || "Operator console"}</p>
            </div>
          </div>

          <div className="workspace-sidebar-actions">
            {!isMobile ? (
              <button
                type="button"
                className="sidebar-collapse-button"
                onClick={() => setCollapsed((current) => !current)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <span />
                <span />
              </button>
            ) : null}
          </div>
        </div>

        <nav className="workspace-navigation" aria-label="Admin navigation">
          {ADMIN_NAV_GROUPS.map((group) => (
            <section className="workspace-nav-group" key={group.label}>
              <p className="workspace-nav-group-title">{group.label}</p>
              <div className="workspace-nav-list">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `workspace-nav-item${isActive ? " is-active" : ""}`
                    }
                  >
                    <span className="workspace-nav-icon" aria-hidden="true">
                      <NavIcon name={item.icon} />
                    </span>

                    <span className="workspace-nav-copy">
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </span>

                    {item.badge ? <span className="workspace-nav-badge">{item.badge}</span> : null}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div className="workspace-sidebar-footer">
          <div className="workspace-user-card">
            <p className="workspace-kicker">Signed in</p>
            <strong>{session?.user?.name || "Workspace user"}</strong>
            <span>{session?.user?.role || "admin"}</span>
          </div>

          <button type="button" className="secondary-button workspace-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-header workspace-topbar">
          <div className="workspace-header-copy">
            <p className="workspace-kicker">Management Console</p>
            <h1>{currentPage?.label || "Dashboard"}</h1>
            <p>
              {currentPage?.description ||
                "Premium restaurant operating workspace with route-based modules, live updates, and a responsive CRM-style shell."}
            </p>
          </div>

          <div className="workspace-header-meta">
            <div className="workspace-status-chip">
              <span className="status-dot" />
              <span>Live workspace</span>
            </div>
            <div className="workspace-status-chip muted">
              <span>{isMobile ? "Mobile" : collapsed ? "Compact" : "Desktop"}</span>
            </div>
          </div>
        </header>

        <section className="workspace-main-content">{children}</section>
      </main>
    </div>
  );
}
