import { useEffect, useMemo, useRef, useState } from "react";
import { dishes, deliveryInfo } from "./data";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import PaymentModal from "./components/PaymentModal";
import {
  DEFAULT_SORT,
  filterDishes,
  getEmptyStateSuggestions,
  getPriceBounds,
  sortDishes,
} from "./utils/searchFilters";
import { track } from "./utils/track";
import "./App.css";

const CATEGORIES = [...new Set(dishes.map((d) => d.category))];
const DIETARY_TAGS = ["vegetarian", "vegan", "glutenFree"].filter((tag) =>
  dishes.some((d) => d.dietary.includes(tag))
);
const PRICE_BOUNDS = getPriceBounds(dishes);
const SEARCH_DEBOUNCE_MS = 300;

const DEFAULT_FILTERS = {
  search: "",
  categories: [],
  dietaryTags: [],
  priceMin: PRICE_BOUNDS.min,
  priceMax: PRICE_BOUNDS.max,
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(DEFAULT_SORT);

  const isFirstRender = useRef(true);

  // AC1: debounce free-text search 300ms after the last keystroke before filtering.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const filteredDishes = useMemo(() => filterDishes(dishes, filters), [filters]);
  const sortedDishes = useMemo(() => sortDishes(filteredDishes, sort), [filteredDishes, sort]);

  const suggestions = useMemo(
    () => (sortedDishes.length === 0 ? getEmptyStateSuggestions(dishes, filters, PRICE_BOUNDS) : []),
    [sortedDishes, filters]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    track("search_filter_applied", {
      screen: "menu",
      search_term_present: filters.search.length > 0,
      categories: filters.categories,
      dietary_tags: filters.dietaryTags,
      price_min: filters.priceMin,
      price_max: filters.priceMax,
      result_count: sortedDishes.length,
    });
    if (sortedDishes.length === 0) {
      track("search_no_results", {
        screen: "menu",
        active_filters: filters,
        suggestion_shown: suggestions.length > 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function handleSortChange(value) {
    setSort(value);
    track("sort_applied", { screen: "menu", sort_type: value, result_count: sortedDishes.length });
  }

  function toggleCategory(category) {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }

  function toggleDietaryTag(tag) {
    setFilters((prev) => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag],
    }));
  }

  function handlePriceChange({ min, max }) {
    setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
  }

  function resetFilters() {
    setSearchInput("");
    setFilters(DEFAULT_FILTERS);
  }

  function applySuggestion(suggestion) {
    setFilters(suggestion.relaxedFilters);
  }

  function addToCart(dish) {
    setCart((prev) => [...prev, { ...dish, quantity: 1 }]);
    track("search_result_selected", {
      screen: "menu",
      item_id: dish.id,
      active_filters_present:
        filters.search.length > 0 ||
        filters.categories.length > 0 ||
        filters.dietaryTags.length > 0 ||
        filters.priceMin > PRICE_BOUNDS.min ||
        filters.priceMax < PRICE_BOUNDS.max,
      position_in_list: sortedDishes.findIndex((d) => d.id === dish.id),
    });
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  const cartCount = cart.length;

  return (
    <div className="app">
      <header className="app-header">
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <img src={`${import.meta.env.BASE_URL}deliveroo-logo.png`} alt="Deliveroo" height="36" />
          <h1>roo<span style={{color:"#1a271f"}}>food</span></h1>
          <span className="delivery-eta">
            <span className="eta-dot" />
            <span className="eta-icon">🛵</span>
            Delivery in {deliveryInfo.etaMin}–{deliveryInfo.etaMax} min
          </span>
        </div>
        <div className="cart-badge-wrapper">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </header>

      <main className="app-main">
        <Menu
          dishes={sortedDishes}
          onAddToCart={addToCart}
          searchFilterProps={{
            searchInput,
            onSearchChange: setSearchInput,
            categories: CATEGORIES,
            selectedCategories: filters.categories,
            onToggleCategory: toggleCategory,
            dietaryTags: DIETARY_TAGS,
            selectedDietaryTags: filters.dietaryTags,
            onToggleDietaryTag: toggleDietaryTag,
            priceBounds: PRICE_BOUNDS,
            priceRange: { min: filters.priceMin, max: filters.priceMax },
            onPriceChange: handlePriceChange,
            sort,
            onSortChange: handleSortChange,
          }}
          emptyState={{
            suggestions,
            onReset: resetFilters,
            onApplySuggestion: applySuggestion,
          }}
        />
        <Cart cart={cart} onRemove={removeFromCart} onCheckout={() => setShowPayment(true)} />
      </main>
      {showPayment && (
        <PaymentModal
          cart={cart}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setCart([]); setShowPayment(false); }}
        />
      )}
    </div>
  );
}
