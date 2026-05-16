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
  lastOrder: null
};

function loadInitialState() {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
  } catch {
    return defaultState;
  }
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
                    specialInstructions:
                      entry.specialInstructions || action.payload.specialInstructions
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
        lastOrder: action.payload
      };
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
