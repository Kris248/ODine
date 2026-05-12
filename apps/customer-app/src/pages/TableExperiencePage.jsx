import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CartPanel } from "../components/cart/CartPanel.jsx";
import { ErrorScreen } from "../components/common/ErrorScreen.jsx";
import { LoadingScreen } from "../components/common/LoadingScreen.jsx";
import { ExperienceControls } from "../components/experience/ExperienceControls.jsx";
import { ExperienceHero } from "../components/experience/ExperienceHero.jsx";
import { MenuSection } from "../components/experience/MenuSection.jsx";
import { buildOrderPayload } from "../models/menu.js";
import { useRestaurantExperience } from "../hooks/useRestaurantExperience.js";
import { createGuestOrder } from "../services/api/customerApi.js";
import { useCart } from "../store/CartContext.jsx";

export function TableExperiencePage() {
  const { restaurantId, tableId } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useRestaurantExperience(restaurantId, tableId);
  const {
    cartItems,
    addItem,
    decreaseItem,
    increaseItem,
    updateItemNotes,
    clearCart,
    itemCount,
    subtotal
  } = useCart();

  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [guest, setGuest] = useState({
    guestName: "",
    guestPhone: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const deferredSearch = useDeferredValue(search);

  const filteredCategories = useMemo(() => {
    if (!data) {
      return [];
    }

    const query = deferredSearch.trim().toLowerCase();

    return data.categories
      .filter((category) => !activeCategoryId || category._id === activeCategoryId)
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          if (!query) {
            return true;
          }
          return [item.name, item.description].some((value) =>
            String(value || "").toLowerCase().includes(query)
          );
        })
      }))
      .filter((category) => category.items.length > 0);
  }, [activeCategoryId, data, deferredSearch]);

  function handleGuestChange(field, value) {
    setGuest((current) => ({ ...current, [field]: value }));
  }

  function handleCategoryChange(categoryId) {
    startTransition(() => {
      setActiveCategoryId(categoryId);
    });
  }

  async function handlePlaceOrder() {
    if (!data) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildOrderPayload({
        restaurantId,
        tableId,
        guest,
        cartItems
      });
      const result = await createGuestOrder(payload);
      clearCart();
      navigate(`/order/${result.order._id}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <LoadingScreen
        title="Dining room loading"
        body="We are setting the table, selecting the right menu, and preparing your premium ordering flow."
      />
    );
  }

  if (error || !data) {
    return <ErrorScreen title="Table unavailable" message={error || "This QR route is not ready."} />;
  }

  const currency = data.restaurant?.settings?.currency || "INR";
  const taxRate = data.restaurant?.settings?.taxRate || 0;

  return (
    <div className="experience-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <ExperienceHero
        restaurant={data.restaurant}
        table={data.table}
        featuredItems={data.featuredItems}
        currency={currency}
      />
      <ExperienceControls
        search={search}
        onSearchChange={setSearch}
        activeCategoryId={activeCategoryId}
        onCategoryChange={handleCategoryChange}
        categories={data.categories}
      />
      <section className="experience-grid">
        <div className="menu-stack">
          {filteredCategories.length === 0 ? (
            <div className="empty-state-card">
              <h2>No dishes matched that search</h2>
              <p>Try a broader ingredient, course, or flavor term.</p>
            </div>
          ) : null}
          {filteredCategories.map((category) => (
            <MenuSection
              key={category._id}
              category={category}
              onAddItem={addItem}
              currency={currency}
            />
          ))}
        </div>
        <CartPanel
          currency={currency}
          guest={guest}
          onGuestChange={handleGuestChange}
          cartItems={cartItems}
          itemCount={itemCount}
          subtotal={subtotal}
          taxRate={taxRate}
          onDecreaseItem={decreaseItem}
          onIncreaseItem={increaseItem}
          onItemNotesChange={updateItemNotes}
          onPlaceOrder={handlePlaceOrder}
          submitting={submitting}
        />
      </section>
    </div>
  );
}
