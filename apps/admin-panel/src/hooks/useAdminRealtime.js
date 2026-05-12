import { useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/env.js";
import { useAdminWorkspace } from "../store/AdminWorkspaceContext.jsx";
import { useSession } from "../store/SessionContext.jsx";

export function useAdminRealtime() {
  const { session } = useSession();
  const { actions } = useAdminWorkspace();

  useEffect(() => {
    if (!session?.user?.restaurantId) {
      return undefined;
    }

    const socket = io(SOCKET_URL);
    socket.emit("join", { restaurantId: session.user.restaurantId, kind: "admin" });
    socket.on("order:new", actions.ingestLiveOrder);
    socket.on("order:status-updated", actions.ingestOrderUpdate);

    return () => socket.disconnect();
  }, [actions, session]);
}
