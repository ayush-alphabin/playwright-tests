import {
  getAllProducts,
  searchProducts,
  sortProducts,
  getCategories,
  type Product,
} from '../services/product-service';
import { CartService } from '../services/cart-service';
import { formatCurrency } from '../utils/formatting';
import { createProductCard } from '../components/product-card';

export function renderProducts(
  container: HTMLElement,
  cartService: CartService,
  updateBadge: () => void
): void {
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Products';
  container.appendChild(heading);

  // Controls bar
  const controls = document.createElement('div');
  controls.className = 'controls-bar';

  // Category filter
  const categorySelect = document.createElement('select');
  categorySelect.setAttribute('data-testid', 'category-filter');
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All Categories';
  categorySelect.appendChild(allOption);

  for (const cat of getCategories()) {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  }
  controls.appendChild(categorySelect);

  // Sort dropdown
  const sortSelect = document.createElement('select');
  sortSelect.setAttribute('data-testid', 'sort-select');
  const sortOptions: { value: string; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];
  for (const s of sortOptions) {
    const opt = document.createElement('option');
    opt.value = s.value;
    opt.textContent = s.label;
    sortSelect.appendChild(opt);
  }
  controls.appendChild(sortSelect);
  container.appendChild(controls);

  // Product grid
  const grid = document.createElement('div');
  grid.className = 'product-grid';
  grid.setAttribute('data-testid', 'product-grid');
  container.appendChild(grid);

  // Read search query from URL hash
  function getSearchQuery(): string {
    const hash = window.location.hash;
    const qIndex = hash.indexOf('?');
    if (qIndex === -1) return '';
    const params = new URLSearchParams(hash.slice(qIndex + 1));
    return params.get('q') || '';
  }

  function renderGrid(): void {
    grid.innerHTML = '';

    const query = getSearchQuery();
    const category = categorySelect.value;
    const sort = sortSelect.value as 'price-asc' | 'price-desc' | 'rating' | 'name';

    let products: Product[];
    if (query) {
      products = searchProducts(query);
    } else {
      products = getAllProducts();
    }

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    products = sortProducts(products, sort);

    if (products.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-message';
      empty.textContent = 'No products found.';
      grid.appendChild(empty);
      return;
    }

    for (const product of products) {
      const card = createProductCard(product, (p) => {
        cartService.addItem(p);
        updateBadge();
      });
      grid.appendChild(card);
    }
  }

  categorySelect.addEventListener('change', renderGrid);
  sortSelect.addEventListener('change', renderGrid);

  renderGrid();
}
