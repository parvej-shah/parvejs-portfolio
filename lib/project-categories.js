// Single source of truth for the project-category options shared by the
// BuyerSegments cards and the Contact form. Cards dispatch a stable `id`;
// the form matches on that id, so the visible labels can change freely
// without breaking the selection.
export const PROJECT_CATEGORIES = [
  { id: "ai-automation", label: "AI Automation & Voice" },
  { id: "saas-product", label: "SaaS / Web Product" },
  { id: "scale-optimize", label: "Existing System & Scale" },
];

export const DEFAULT_CATEGORY_ID = PROJECT_CATEGORIES[0].id;

export const SELECT_CATEGORY_EVENT = "select-project-category";

export function categoryLabelFor(id) {
  return PROJECT_CATEGORIES.find((c) => c.id === id)?.label ?? "";
}
