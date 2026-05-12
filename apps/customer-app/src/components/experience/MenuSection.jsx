import { formatCurrency } from "../../models/menu.js";

export function MenuSection({ category, onAddItem, currency }) {
  return (
    <section className="menu-section">
      <div className="section-head">
        <div>
          <p className="section-tag">Course</p>
          <h2>{category.name}</h2>
        </div>
        <span>{category.items.length} selections</span>
      </div>
      <div className="dish-grid">
        {category.items.map((item) => (
          <article className="dish-card" key={item._id}>
            <div className="dish-art">
              <div className="dish-glow" />
              <span className="dish-badge">{item.isVeg ? "Vegetarian" : "Chef crafted"}</span>
            </div>
            <div className="dish-content">
              <div className="dish-copy">
                <h3>{item.name}</h3>
                <p>{item.description || "A balanced plate with refined texture and finish."}</p>
              </div>
              <div className="dish-meta">
                <span>{formatCurrency(item.price, currency)}</span>
                <span>Spice {item.spiceLevel || 0}/3</span>
              </div>
              <button className="primary-button" onClick={() => onAddItem(item)}>
                Add to order
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
