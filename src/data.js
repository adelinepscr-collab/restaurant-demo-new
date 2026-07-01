export const deliveryInfo = {
  etaMin: 25,
  etaMax: 35, // average delivery estimate, in minutes
};

export const dishes = [
  { id: 1, name: "Bruschetta", description: "Toasted bread with tomatoes, garlic and fresh basil", price: 6.5, category: "Starters", emoji: "🍞", dietary: ["vegetarian", "vegan"], rating: { average: 4.3, count: 128 } },
  { id: 2, name: "Soup of the Day", description: "Ask your waiter for today's homemade soup", price: 5.0, category: "Starters", emoji: "🍲", dietary: ["vegetarian"], rating: { average: 4.0, count: 54 } },
  { id: 3, name: "Garlic Prawns", description: "Sautéed king prawns in garlic butter and white wine", price: 9.5, category: "Starters", emoji: "🦐", dietary: ["glutenFree"], rating: { average: 4.6, count: 210 } },
  { id: 4, name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons and Caesar dressing", price: 7.0, category: "Starters", emoji: "🥗", dietary: ["vegetarian"], rating: { average: 4.1, count: 96 } },
  { id: 5, name: "Classic Burger", description: "Beef patty, cheddar, lettuce, tomato and pickles", price: 14.0, category: "Mains", emoji: "🍔", dietary: [], rating: { average: 4.8, count: 342 } },
  { id: 6, name: "Grilled Salmon", description: "Atlantic salmon with lemon butter sauce and seasonal vegetables", price: 18.5, category: "Mains", emoji: "🐟", dietary: ["glutenFree"], rating: { average: 4.7, count: 189 } },
  { id: 7, name: "Margherita Pizza", description: "San Marzano tomato sauce, fresh mozzarella and basil", price: 13.0, category: "Mains", emoji: "🍕", dietary: ["vegetarian"], rating: { average: 4.9, count: 401 } },
  { id: 8, name: "Mushroom Risotto", description: "Arborio rice with wild mushrooms, white wine and parmesan", price: 15.0, category: "Mains", emoji: "🍚", dietary: ["vegetarian", "glutenFree"], rating: { average: 4.4, count: 87 } },
  { id: 9, name: "Chicken Tikka Masala", description: "Tender chicken in a rich tomato and cream sauce with rice", price: 16.0, category: "Mains", emoji: "🍛", dietary: ["glutenFree"], rating: { average: 4.5, count: 156 } },
  { id: 10, name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten centre and vanilla ice cream", price: 7.5, category: "Desserts", emoji: "🍫", dietary: ["vegetarian"], rating: { average: 4.8, count: 275 } },
  { id: 11, name: "Crème Brûlée", description: "Classic French vanilla custard with a caramelised sugar crust", price: 6.5, category: "Desserts", emoji: "🍮", dietary: ["vegetarian", "glutenFree"], rating: { average: 4.2, count: 63 } },
  { id: 12, name: "Tiramisu", description: "Italian coffee-soaked ladyfingers with mascarpone cream", price: 7.0, category: "Desserts", emoji: "☕", dietary: ["vegetarian"], rating: { average: 4.6, count: 198 } },
];

export const DIETARY_LABELS = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  glutenFree: "Gluten-free",
};
