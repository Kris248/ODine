import { Navigate, Route, Routes } from "react-router-dom";
import { AdminWorkspaceProvider } from "../store/AdminWorkspaceContext.jsx";
import { SessionProvider, useSession } from "../store/SessionContext.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { WorkspacePage } from "../pages/WorkspacePage.jsx";

function ProtectedWorkspace() {
  const { session } = useSession();
  return session ? <WorkspacePage /> : <Navigate to="/login" replace />;
}

function PublicLogin() {
  const { session } = useSession();
  return session ? <Navigate to="/" replace /> : <LoginPage />;
}

export function AppRouter() {
  return (
    <SessionProvider>
      <AdminWorkspaceProvider>
        <Routes>
          <Route path="/login" element={<PublicLogin />} />
          <Route path="/*" element={<ProtectedWorkspace />} />
        </Routes>
      </AdminWorkspaceProvider>
    </SessionProvider>
  );
}
