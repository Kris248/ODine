import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { calculateOrderSummary } from "../utils/cart.js";

const STORAGE_KEY = "odine.customer.ordering";

const defaultState = {
  session: null,
  restaurant: null,
  table: null,
  pricing: {
    currency: "INR",
    taxRate: 0.05,
    serviceFee: 0
  },
  paymentMethods: [],
  cartItems: [],
  orderNote: "",
  guestDetails: {
    name: "",
    phone: ""
  },
  selectedPaymentMethodId: "upi",
  activeCheckoutSession: null,
  lastOrder: null,
  orderHistory: []
};

function loadInitialState() {
  if (typeof window === "undefined") return defaultState;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored);
    return {
      ...defaultState,
      ...parsed,
      guestDetails: {
        ...defaultState.guestDetails,
        ...(parsed.guestDetails || {})
      },
      pricing: {
        ...defaultState.pricing,
        ...(parsed.pricing || {})
      },
      orderHistory: Array.isArray(parsed.orderHistory) ? parsed.orderHistory : []
    };
  } catch {
    return defaultState;
  }
}

function addToHistory(history, order) {
  if (!order?.id) return history;
  const entry = {
    ...order,
    orderHistoryUpdatedAt: new Date().toISOString()
  };
  const next = [entry, ...history.filter((item) => item.id !== order.id)];
  return next.slice(0, 8);
}

function orderingReducer(state, action) {
  switch (action.type) {
    case "hydrate_restaurant":
      return {
        ...state,
        session: action.payload.session || state.session,
        restaurant: action.payload.restaurant,
        table: action.payload.table,
        pricing: action.payload.pricing,
        paymentMethods: action.payload.paymentMethods,
        selectedPaymentMethodId:
          state.selectedPaymentMethodId ||
          action.payload.paymentMethods?.[0]?.id ||
          defaultState.selectedPaymentMethodId
      };
    case "add_to_cart": {
      const existing = state.cartItems.find((entry) => entry.key === action.payload.key);
      return {
        ...state,
        activeCheckoutSession: null,
        cartItems: existing
          ? state.cartItems.map((entry) =>
              entry.key === action.payload.key
                ? {
                    ...entry,
                    quantity: entry.quantity + action.payload.quantity,
                    specialInstructions: entry.specialInstructions || action.payload.specialInstructions
                  }
                : entry
            )
          : [...state.cartItems, action.payload]
      };
    }
    case "change_quantity":
      return {
        ...state,
        activeCheckoutSession: null,
        cartItems: state.cartItems
          .map((entry) =>
            entry.key === action.payload.key
              ? { ...entry, quantity: entry.quantity + action.payload.delta }
              : entry
          )
          .filter((entry) => entry.quantity > 0)
      };
    case "remove_item":
      return {
        ...state,
        activeCheckoutSession: null,
        cartItems: state.cartItems.filter((entry) => entry.key !== action.payload)
      };
    case "set_order_note":
      return {
        ...state,
        activeCheckoutSession: null,
        orderNote: action.payload
      };
    case "set_guest_details":
      return {
        ...state,
        activeCheckoutSession: null,
        guestDetails: {
          ...state.guestDetails,
          ...action.payload
        }
      };
    case "set_payment_method":
      return {
        ...state,
        activeCheckoutSession: null,
        selectedPaymentMethodId: action.payload
      };
    case "set_active_checkout_session":
      return {
        ...state,
        activeCheckoutSession: action.payload
      };
    case "set_last_order":
      return {
        ...state,
        lastOrder: action.payload,
        orderHistory: addToHistory(state.orderHistory, action.payload)
      };
    case "sync_order_update": {
      const updatedOrder = action.payload;
      return {
        ...state,
        lastOrder:
          state.lastOrder?.id === updatedOrder?.id
            ? updatedOrder
            : state.lastOrder,
        orderHistory: updatedOrder?.id
          ? addToHistory(state.orderHistory, updatedOrder)
          : state.orderHistory
      };
    }
    case "clear_checkout":
      return {
        ...state,
        cartItems: [],
        orderNote: "",
        activeCheckoutSession: null,
        selectedPaymentMethodId: state.paymentMethods[0]?.id || defaultState.selectedPaymentMethodId
      };
    default:
      return state;
  }
}

const OrderingContext = createContext(null);

export function OrderingProvider({ children }) {
  const [state, dispatch] = useReducer(orderingReducer, defaultState, loadInitialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const summary = useMemo(
    () => calculateOrderSummary(state.cartItems, state.pricing),
    [state.cartItems, state.pricing]
  );

  const itemCount = useMemo(
    () => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [state.cartItems]
  );

  const value = useMemo(
    () => ({
      ...state,
      summary,
      itemCount,
      hydrateRestaurant: (payload) => dispatch({ type: "hydrate_restaurant", payload }),
      addToCart: (payload) => dispatch({ type: "add_to_cart", payload }),
      changeQuantity: (key, delta) => dispatch({ type: "change_quantity", payload: { key, delta } }),
      removeItem: (key) => dispatch({ type: "remove_item", payload: key }),
      setOrderNote: (payload) => dispatch({ type: "set_order_note", payload }),
      setGuestDetails: (payload) => dispatch({ type: "set_guest_details", payload }),
      setPaymentMethod: (payload) => dispatch({ type: "set_payment_method", payload }),
      setActiveCheckoutSession: (payload) =>
        dispatch({ type: "set_active_checkout_session", payload }),
      setLastOrder: (payload) => dispatch({ type: "set_last_order", payload }),
      syncOrderUpdate: (payload) => dispatch({ type: "sync_order_update", payload }),
      clearCheckout: () => dispatch({ type: "clear_checkout" })
    }),
    [itemCount, state, summary]
  );

  return <OrderingContext.Provider value={value}>{children}</OrderingContext.Provider>;
}

export function useOrdering() {
  const context = useContext(OrderingContext);

  if (!context) {
    throw new Error("useOrdering must be used within an OrderingProvider.");
  }

  return context;
}
