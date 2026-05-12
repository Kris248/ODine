import { useState } from "react";
import { FormSection } from "../../components/common/FormSection.jsx";

export function SettingsModule({ restaurant, onSave }) {
  const [form, setForm] = useState({
    name: restaurant?.name || "",
    slug: restaurant?.slug || "",
    settings: {
      currency: restaurant?.settings?.currency || "INR",
      taxRate: restaurant?.settings?.taxRate || 0,
      serviceChargeRate: restaurant?.settings?.serviceChargeRate || 0,
      brandColor: restaurant?.settings?.brandColor || "#c5521e"
    }
  });

  async function handleSubmit(event) {
    event.preventDefault();
    await onSave({
      name: form.name,
      slug: form.slug,
      settings: {
        ...form.settings,
        taxRate: Number(form.settings.taxRate),
        serviceChargeRate: Number(form.settings.serviceChargeRate)
      }
    });
  }

  return (
    <div className="workspace-stack">
      <FormSection
        title="Restaurant profile"
        description="Brand, pricing rules, and outlet settings that shape the customer and operator experience."
      >
        <form className="form-stack" onSubmit={handleSubmit}>
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Restaurant name"
          />
          <input
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            placeholder="Slug"
          />
          <input
            value={form.settings.currency}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                settings: { ...current.settings, currency: event.target.value }
              }))
            }
            placeholder="Currency"
          />
          <input
            type="number"
            value={form.settings.taxRate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                settings: { ...current.settings, taxRate: event.target.value }
              }))
            }
            placeholder="Tax rate"
          />
          <input
            type="number"
            value={form.settings.serviceChargeRate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                settings: { ...current.settings, serviceChargeRate: event.target.value }
              }))
            }
            placeholder="Service charge rate"
          />
          <input
            value={form.settings.brandColor}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                settings: { ...current.settings, brandColor: event.target.value }
              }))
            }
            placeholder="Brand color"
          />
          <button className="primary-button" type="submit">
            Save settings
          </button>
        </form>
      </FormSection>
    </div>
  );
}
