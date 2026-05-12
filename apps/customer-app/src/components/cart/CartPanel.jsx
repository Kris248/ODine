import { formatCurrency } from "../../models/menu.js";

export function CartPanel({
  currency,
  guest,
  onGuestChange,
  cartItems,
  itemCount,
  subtotal,
  taxRate,
  onDecreaseItem,
  onIncreaseItem,
  onItemNotesChange,
  onPlaceOrder,
  submitting
}) {
  const tax = subtotal * ((taxRate || 0) / 100);
  const total = subtotal + tax;

  return (
    <aside className="cart-panel">
      <div className="cart-head">
        <div>
          <p className="section-tag">Private cart</p>
          <h2>Your table order</h2>
        </div>
        <span>{itemCount} items</span>
      </div>

      <div className="cart-lines">
        {cartItems.length === 0 ? (
          <div className="empty-state-card">
            <p>Start with a signature dish and build a table-side experience worth remembering.</p>
          </div>
        ) : null}

        {cartItems.map((item) => (
          <div className="cart-line" key={item.itemId}>
            <div className="cart-line-head">
              <div>
                <strong>{item.name}</strong>
                <p>{formatCurrency(item.price, currency)} each</p>
              </div>
              <div className="stepper">
                <button onClick={() => onDecreaseItem(item.itemId)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onIncreaseItem(item.itemId)}>+</button>
              </div>
            </div>
            <textarea
              rows="2"
              placeholder="Optional note for the chef"
              value={item.specialInstructions}
              onChange={(event) => onItemNotesChange(item.itemId, event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="guest-card">
        <p className="section-tag">Guest details</p>
        <input
          placeholder="Guest name"
          value={guest.guestName}
          onChange={(event) => onGuestChange("guestName", event.target.value)}
        />
        <input
          placeholder="Phone number"
          value={guest.guestPhone}
          onChange={(event) => onGuestChange("guestPhone", event.target.value)}
        />
        <textarea
          rows="3"
          placeholder="Allergies, celebration notes, or service requests"
          value={guest.notes}
          onChange={(event) => onGuestChange("notes", event.target.value)}
        />
      </div>

      <div className="bill-card">
        <div className="bill-row">
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal, currency)}</strong>
        </div>
        <div className="bill-row">
          <span>Tax</span>
          <strong>{formatCurrency(tax, currency)}</strong>
        </div>
        <div className="bill-row total">
          <span>Total</span>
          <strong>{formatCurrency(total, currency)}</strong>
        </div>
        <button
          className="primary-button"
          disabled={!cartItems.length || !guest.guestName.trim() || submitting}
          onClick={onPlaceOrder}
        >
          {submitting ? "Sending to kitchen..." : "Confirm order"}
        </button>
      </div>
    </aside>
  );
}
