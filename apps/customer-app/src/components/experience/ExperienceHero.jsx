import { formatCurrency } from "../../models/menu.js";

export function ExperienceHero({ restaurant, table, featuredItems, currency }) {
  return (
    <section
      className="experience-hero"
      style={{ "--brand": restaurant?.settings?.brandColor || "#9a5f2d" }}
    >
      <div className="hero-copy">
        <p className="kicker">Table {table.tableNumber} private dining experience</p>
        <h1>{restaurant.name}</h1>
        <p className="hero-body">
          Elegant service, direct-from-table ordering, and a menu crafted to feel premium from
          the first tap to the final course.
        </p>
        <div className="hero-pills">
          <span>Curated menu</span>
          <span>Instant kitchen routing</span>
          <span>Live order updates</span>
        </div>
      </div>
      <div className="hero-spotlight">
        <p className="spotlight-label">Chef's highlights</p>
        {featuredItems.map((item, index) => (
          <div className="spotlight-card" key={item._id}>
            <span className="spotlight-index">0{index + 1}</span>
            <div>
              <strong>{item.name}</strong>
              <p>{item.description || "Signature plating with premium ingredients."}</p>
            </div>
            <span>{formatCurrency(item.price, currency)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
