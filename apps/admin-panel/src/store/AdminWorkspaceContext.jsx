import { createContext, useContext, useMemo, useReducer } from "react";
import { ORDER_STATUSES } from "@odine/shared";
import { createStaffMember } from "../services/api/authApi.js";
import {
  createCategory,
  createMenuItem,
  createTable,
  fetchWorkspaceBundle,
  updateMenuItem,
  updateOrderStatus,
  updateRestaurant,
  updateTable
} from "../services/api/workspaceApi.js";

const AdminWorkspaceContext = createContext(null);

const initialState = {
  loading: false,
  saving: false,
  error: "",
  notice: "",
  restaurant: null,
  tables: [],
  categories: [],
  items: [],
  orders: [],
  staff: []
};

function reducer(state, action) {
  switch (action.type) {
    case "load:start":
      return { ...state, loading: true, error: "", notice: "" };
    case "load:success":
      return { ...state, loading: false, ...action.payload };
    case "save:start":
      return { ...state, saving: true, error: "", notice: "" };
    case "save:done":
      return { ...state, saving: false, notice: action.notice || "" };
    case "error":
      return { ...state, loading: false, saving: false, error: action.message };
    case "orders:prepend":
      return { ...state, orders: [action.order, ...state.orders] };
    case "orders:replace":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.order._id ? action.order : order
        )
      };
    default:
      return state;
  }
}

export function AdminWorkspaceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function refreshWorkspace() {
    dispatch({ type: "load:start" });
    try {
      const payload = await fetchWorkspaceBundle();
      dispatch({ type: "load:success", payload });
    } catch (error) {
      dispatch({ type: "error", message: error.message });
    }
  }

  async function runMutation(task, notice) {
    dispatch({ type: "save:start" });
    try {
      await task();
      const payload = await fetchWorkspaceBundle();
      dispatch({ type: "load:success", payload });
      dispatch({ type: "save:done", notice });
    } catch (error) {
      dispatch({ type: "error", message: error.message });
      throw error;
    }
  }

  const actions = {
    refreshWorkspace,
    createTable: (payload) => runMutation(() => createTable(payload), "Table created."),
    setTableStatus: (id, status) =>
      runMutation(() => updateTable(id, { status }), "Table status updated."),
    createCategory: (payload) =>
      runMutation(() => createCategory(payload), "Category added to menu."),
    createMenuItem: (payload) =>
      runMutation(() => createMenuItem(payload), "Menu item published."),
    toggleMenuAvailability: (id, isAvailable) =>
      runMutation(() => updateMenuItem(id, { isAvailable }), "Menu availability updated."),
    createStaff: (payload) =>
      runMutation(() => createStaffMember(payload), "Staff account created."),
    setOrderStatus: (id, status) => {
      if (!ORDER_STATUSES.includes(status)) {
        throw new Error("Invalid order status.");
      }
      return runMutation(() => updateOrderStatus(id, { status }), "Order status updated.");
    },
    saveRestaurantProfile: (payload) =>
      runMutation(() => updateRestaurant(payload), "Restaurant profile saved."),
    ingestLiveOrder: (order) => dispatch({ type: "orders:prepend", order }),
    ingestOrderUpdate: (order) => dispatch({ type: "orders:replace", order })
  };

  const value = useMemo(() => ({ state, actions }), [state]);

  return <AdminWorkspaceContext.Provider value={value}>{children}</AdminWorkspaceContext.Provider>;
}

export function useAdminWorkspace() {
  const context = useContext(AdminWorkspaceContext);
  if (!context) {
    throw new Error("useAdminWorkspace must be used within AdminWorkspaceProvider.");
  }
  return context;
}
