import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addItem(item) {
    setCartItems((current) => {
      const existing = current.find((entry) => entry.itemId === item._id);
      if (existing) {
        return current.map((entry) =>
          entry.itemId === item._id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }

      return [
        ...current,
        {
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          specialInstructions: ""
        }
      ];
    });
  }

  function decreaseItem(itemId) {
    setCartItems((current) =>
      current
        .map((entry) =>
          entry.itemId === itemId ? { ...entry, quantity: entry.quantity - 1 } : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  }

  function increaseItem(itemId) {
    setCartItems((current) =>
      current.map((entry) =>
        entry.itemId === itemId ? { ...entry, quantity: entry.quantity + 1 } : entry
      )
    );
  }

  function updateItemNotes(itemId, specialInstructions) {
    setCartItems((current) =>
      current.map((entry) =>
        entry.itemId === itemId ? { ...entry, specialInstructions } : entry
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totals = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { itemCount, subtotal };
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      addItem,
      decreaseItem,
      increaseItem,
      updateItemNotes,
      clearCart,
      ...totals
    }),
    [cartItems, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return context;
}
