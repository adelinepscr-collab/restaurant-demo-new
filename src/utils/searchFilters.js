// Strips accents/diacritics and lowercases, so "Crème" matches "creme". Spec AC1: accent/case-insensitive substring match.
export function normalizeText(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export const DEFAULT_SORT = "relevance";

export function getPriceBounds(dishes) {
  const prices = dishes.map((d) => d.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function matchesFilters(dish, filters) {
  const { search, categories, dietaryTags, priceMin, priceMax } = filters;

  if (search) {
    const term = normalizeText(search);
    const haystack = normalizeText(`${dish.name} ${dish.description}`);
    if (!haystack.includes(term)) return false;
  }

  // Categories: OR within the family (match any selected category).
  if (categories.length > 0 && !categories.includes(dish.category)) return false;

  // Dietary tags: AND within the family (cumulative dietary constraints).
  if (dietaryTags.length > 0 && !dietaryTags.every((tag) => dish.dietary.includes(tag))) return false;

  if (dish.price < priceMin || dish.price > priceMax) return false;

  return true;
}

export function filterDishes(dishes, filters) {
  return dishes.filter((dish) => matchesFilters(dish, filters));
}

export function sortDishes(dishes, sort) {
  const sorted = [...dishes];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "popularity":
      // AC7: rating average desc, ties broken by review count desc.
      sorted.sort((a, b) => b.rating.average - a.rating.average || b.rating.count - a.rating.count);
      break;
    default:
      break; // "relevance" keeps catalog order
  }
  return sorted;
}

const FILTER_FAMILIES = [
  {
    key: "categories",
    label: "category filter",
    isActive: (filters) => filters.categories.length > 0,
    relax: (filters) => ({ ...filters, categories: [] }),
  },
  {
    key: "dietaryTags",
    label: "dietary tags",
    isActive: (filters) => filters.dietaryTags.length > 0,
    relax: (filters) => ({ ...filters, dietaryTags: [] }),
  },
  {
    key: "price",
    label: "price range",
    isActive: (filters, bounds) => filters.priceMin > bounds.min || filters.priceMax < bounds.max,
    relax: (filters, bounds) => ({ ...filters, priceMin: bounds.min, priceMax: bounds.max }),
  },
];

// AC8 management rule: for each active filter family (excluding free-text search),
// test relaxing it alone; keep the ones that alone would unlock results, ranked by
// how many results they'd unlock (most restrictive filter suggested first), max 2.
export function getEmptyStateSuggestions(dishes, filters, bounds) {
  return FILTER_FAMILIES
    .filter((family) => family.isActive(filters, bounds))
    .map((family) => {
      const relaxed = family.relax(filters, bounds);
      const count = filterDishes(dishes, relaxed).length;
      return { key: family.key, label: family.label, relaxedFilters: relaxed, count };
    })
    .filter((candidate) => candidate.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);
}
