import { getAllProducts } from '../services/product-service';
import { formatCurrency } from '../utils/formatting';

export function renderHome(container: HTMLElement): void {
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.setAttribute('data-testid', 'home-heading');
  heading.textContent = 'Welcome to ShopDemo';
  container.appendChild(heading);

  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Discover our curated selection of products.';
  container.appendChild(subtitle);

  // Search bar
  const searchBar = document.createElement('div');
  searchBar.className = 'search-bar';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search products...';
  searchInput.setAttribute('data-testid', 'search-input');
  searchBar.appendChild(searchInput);

  const searchBtn = document.createElement('button');
  searchBtn.className = 'btn btn-primary';
  searchBtn.setAttribute('data-testid', 'search-btn');
  searchBtn.textContent = 'Search';
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.hash = `#/products?q=${encodeURIComponent(query)}`;
    }
  });
  searchBar.appendChild(searchBtn);

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  container.appendChild(searchBar);

  // Featured products
  const section = document.createElement('section');
  section.className = 'featured-section';

  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = 'Featured Products';
  section.appendChild(sectionTitle);

  const grid = document.createElement('div');
  grid.className = 'product-grid';

  const products = getAllProducts().slice(0, 4);
  for (const product of products) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-testid', 'featured-product');

    const image = document.createElement('div');
    image.className = 'card-image';
    image.textContent = product.image;
    card.appendChild(image);

    const body = document.createElement('div');
    body.className = 'card-body';

    const name = document.createElement('h3');
    name.textContent = product.name;
    body.appendChild(name);

    const price = document.createElement('p');
    price.className = 'card-price';
    price.textContent = formatCurrency(product.price);
    body.appendChild(price);

    const link = document.createElement('a');
    link.href = '#/products';
    link.className = 'btn btn-secondary';
    link.textContent = 'View Products';
    body.appendChild(link);

    card.appendChild(body);
    grid.appendChild(card);
  }

  section.appendChild(grid);
  container.appendChild(section);
}
