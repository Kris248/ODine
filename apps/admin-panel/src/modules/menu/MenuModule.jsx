import { FormSection } from "../../components/common/FormSection.jsx";

export function MenuModule({
  categories,
  items,
  onCreateCategory,
  onCreateItem,
  onToggleAvailability
}) {
  async function handleCategorySubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateCategory({
      name: formData.get("name"),
      displayOrder: Number(formData.get("displayOrder"))
    });
    event.currentTarget.reset();
  }

  async function handleItemSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateItem({
      categoryId: formData.get("categoryId"),
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      spiceLevel: Number(formData.get("spiceLevel")),
      isVeg: formData.get("isVeg") === "on"
    });
    event.currentTarget.reset();
  }

  return (
    <div className="workspace-stack">
      <section className="content-grid two-up">
        <FormSection
          title="Category architecture"
          description="Organize menu browsing into clean dining sections that customers can scan quickly."
        >
          <form className="form-stack" onSubmit={handleCategorySubmit}>
            <input name="name" placeholder="Category name" required />
            <input name="displayOrder" type="number" placeholder="Display order" />
            <button className="primary-button" type="submit">
              Create category
            </button>
          </form>
        </FormSection>

        <FormSection
          title="Menu publishing"
          description="Add dishes with pricing, descriptions, dietary markers, and availability control."
        >
          <form className="form-stack" onSubmit={handleItemSubmit}>
            <select name="categoryId" defaultValue="" required>
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input name="name" placeholder="Dish name" required />
            <textarea name="description" placeholder="Description" rows="4" />
            <input name="price" type="number" step="0.01" placeholder="Price" required />
            <input name="spiceLevel" type="number" min="0" max="3" placeholder="Spice level" />
            <label className="checkbox-row">
              <input type="checkbox" name="isVeg" />
              Vegetarian
            </label>
            <button className="primary-button" type="submit">
              Publish item
            </button>
          </form>
        </FormSection>
      </section>

      <section className="workspace-card">
        <div className="card-head">
          <div>
            <h3>Menu inventory table</h3>
            <p>What serious operators need: item visibility, category mapping, and service availability.</p>
          </div>
        </div>
        <div className="entity-list">
          {items.map((item) => (
            <article className="entity-row" key={item._id}>
              <div className="entity-primary">
                <strong>{item.name}</strong>
                <p>{item.categoryId?.name || "Uncategorized"}</p>
                <p>{item.description}</p>
              </div>
              <div className="entity-actions">
                <span className="pill">{item.isVeg ? "veg" : "non-veg"}</span>
                <span className="pill soft">{item.isAvailable ? "available" : "paused"}</span>
                <button
                  className="secondary-button"
                  onClick={() => onToggleAvailability(item._id, !item.isAvailable)}
                >
                  {item.isAvailable ? "Pause item" : "Enable item"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
