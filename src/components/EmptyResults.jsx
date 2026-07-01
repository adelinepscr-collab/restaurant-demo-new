const SUGGESTION_TEXT = {
  categories: "Try without the category filter",
  dietaryTags: "Try without the dietary tags",
  price: "Try without the price range",
};

export default function EmptyResults({ suggestions, onReset, onApplySuggestion }) {
  return (
    <div className="empty-results">
      <span className="empty-results-icon">🔍</span>
      <p className="empty-results-title">No results match your search.</p>
      <div className="empty-results-actions">
        <button type="button" className="filter-btn" onClick={onReset}>
          Reset filters
        </button>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.key}
            type="button"
            className="filter-btn"
            onClick={() => onApplySuggestion(suggestion)}
          >
            {SUGGESTION_TEXT[suggestion.key] ?? `Try without ${suggestion.label}`}
          </button>
        ))}
      </div>
    </div>
  );
}
