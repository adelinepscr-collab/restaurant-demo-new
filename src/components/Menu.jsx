import SearchFilterBar from "./SearchFilterBar";
import EmptyResults from "./EmptyResults";

export default function Menu({
  dishes,
  onAddToCart,
  searchFilterProps,
  emptyState,
}) {
  return (
    <section className="menu">
      <h2>Menu</h2>

      <SearchFilterBar {...searchFilterProps} resultCount={dishes.length} />

      {dishes.length === 0 ? (
        <EmptyResults
          suggestions={emptyState.suggestions}
          onReset={emptyState.onReset}
          onApplySuggestion={emptyState.onApplySuggestion}
        />
      ) : (
        <div className="dish-grid">
          {dishes.map((dish) => (
            <div key={dish.id} className="dish-card">
              <span className="dish-emoji">{dish.emoji}</span>
              <div className="dish-info">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <div className="dish-footer">
                  <span className="dish-price">€{dish.price.toFixed(2)}</span>
                  <button className="add-btn" onClick={() => onAddToCart(dish)}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
