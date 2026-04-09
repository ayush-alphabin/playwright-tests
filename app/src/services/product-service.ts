export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  rating: number;
  stock: number;
  image: string;
}

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Wireless Headphones', price: 79.99, category: 'Electronics', description: 'Noise-cancelling over-ear headphones with 30hr battery.', rating: 4.5, stock: 25, image: '🎧' },
  { id: 'p2', name: 'Running Shoes', price: 129.99, category: 'Footwear', description: 'Lightweight mesh running shoes with cushioned sole.', rating: 4.2, stock: 15, image: '👟' },
  { id: 'p3', name: 'Laptop Stand', price: 49.99, category: 'Accessories', description: 'Adjustable aluminum laptop stand for ergonomic posture.', rating: 4.7, stock: 50, image: '💻' },
  { id: 'p4', name: 'Coffee Maker', price: 199.99, category: 'Kitchen', description: '12-cup programmable coffee maker with thermal carafe.', rating: 4.0, stock: 8, image: '☕' },
  { id: 'p5', name: 'Backpack', price: 59.99, category: 'Accessories', description: 'Water-resistant 30L backpack with laptop compartment.', rating: 4.3, stock: 40, image: '🎒' },
  { id: 'p6', name: 'Smart Watch', price: 249.99, category: 'Electronics', description: 'Fitness tracker with heart rate, GPS, and sleep monitoring.', rating: 4.6, stock: 12, image: '⌚' },
  { id: 'p7', name: 'Desk Lamp', price: 34.99, category: 'Home', description: 'LED desk lamp with adjustable brightness and color temperature.', rating: 4.1, stock: 30, image: '💡' },
  { id: 'p8', name: 'Yoga Mat', price: 24.99, category: 'Fitness', description: 'Non-slip 6mm thick yoga mat with carrying strap.', rating: 4.4, stock: 60, image: '🧘' },
  { id: 'p9', name: 'Bluetooth Speaker', price: 39.99, category: 'Electronics', description: 'Portable waterproof speaker with 12hr battery.', rating: 4.0, stock: 35, image: '🔊' },
  { id: 'p10', name: 'Water Bottle', price: 19.99, category: 'Fitness', description: 'Insulated stainless steel water bottle, keeps cold 24hrs.', rating: 4.8, stock: 100, image: '🥤' },
  { id: 'p11', name: 'Mechanical Keyboard', price: 89.99, category: 'Electronics', description: 'RGB mechanical keyboard with blue switches.', rating: 4.3, stock: 20, image: '⌨️' },
  { id: 'p12', name: 'Plant Pot Set', price: 29.99, category: 'Home', description: 'Set of 3 ceramic plant pots with drainage holes.', rating: 4.5, stock: 45, image: '🪴' },
];

export function getAllProducts(): Product[] {
  return [...PRODUCTS];
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
}

export function getCategories(): string[] {
  return [...new Set(PRODUCTS.map((p) => p.category))].sort();
}

export function sortProducts(products: Product[], by: 'price-asc' | 'price-desc' | 'rating' | 'name'): Product[] {
  const sorted = [...products];
  switch (by) {
    case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
    case 'name': return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}
