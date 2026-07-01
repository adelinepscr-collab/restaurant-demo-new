import { DIETARY_LABELS } from "../data";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "popularity", label: "Popularity" },
];

export default function SearchFilterBar({
  searchInput,
  onSearchChange,
  categories,
  selectedCategories,
  onToggleCategory,
  dietaryTags,
  selectedDietaryTags,
  onToggleDietaryTag,
  priceBounds,
  priceRange,
  onPriceChange,
  sort,
  onSortChange,
  resultCount,
}) {
  const priceSliderDisabled = priceBounds.min === priceBounds.max;

  return (
    <div className="search-filter-bar">
      <input
        type="search"
        className="search-input"
        placeholder="Search dishes by name or description…"
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search dishes"
      />

      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-group-label">Category</span>
          <div className="chip-group">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${selectedCategories.includes(cat) ? "active" : ""}`}
                aria-pressed={selectedCategories.includes(cat)}
                onClick={() => onToggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Dietary</span>
          <div className="chip-group">
            {dietaryTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`filter-btn ${selectedDietaryTags.includes(tag) ? "active" : ""}`}
                aria-pressed={selectedDietaryTags.includes(tag)}
                onClick={() => onToggleDietaryTag(tag)}
              >
                {DIETARY_LABELS[tag] ?? tag}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group price-filter-group">
          <span className="filter-group-label">
            Price: €{priceRange.min.toFixed(2)} – €{priceRange.max.toFixed(2)}
          </span>
          <div className="price-range-slider" aria-disabled={priceSliderDisabled}>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step="0.5"
              value={priceRange.min}
              disabled={priceSliderDisabled}
              aria-label="Minimum price"
              onChange={(e) =>
                onPriceChange({ min: Math.min(Number(e.target.value), priceRange.max), max: priceRange.max })
              }
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step="0.5"
              value={priceRange.max}
              disabled={priceSliderDisabled}
              aria-label="Maximum price"
              onChange={(e) =>
                onPriceChange({ min: priceRange.min, max: Math.max(Number(e.target.value), priceRange.min) })
              }
            />
          </div>
        </div>

        <div className="filter-group sort-group">
          <span className="filter-group-label">Sort by</span>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort results"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="result-count">
        {resultCount} {resultCount === 1 ? "dish" : "dishes"}
      </p>
    </div>
  );
}
