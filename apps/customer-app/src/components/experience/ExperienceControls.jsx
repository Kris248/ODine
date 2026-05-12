export function ExperienceControls({
  search,
  onSearchChange,
  activeCategoryId,
  onCategoryChange,
  categories
}) {
  return (
    <section className="controls-bar">
      <label className="search-shell">
        <span>Search the menu</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Try truffle, paneer, pasta, dessert..."
        />
      </label>
      <div className="category-rail">
        <button
          className={!activeCategoryId ? "category-chip active" : "category-chip"}
          onClick={() => onCategoryChange("")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className={activeCategoryId === category._id ? "category-chip active" : "category-chip"}
            onClick={() => onCategoryChange(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
