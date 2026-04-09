import type { Product } from '../services/product-service';
import { formatCurrency } from '../utils/formatting';

export function createProductCard(
  product: Product,
  onAddToCart?: (product: Product) => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-testid', 'product-card');

  const image = document.createElement('div');
  image.className = 'card-image';
  image.setAttribute('data-testid', 'product-image');
  image.textContent = product.image;
  card.appendChild(image);

  const body = document.createElement('div');
  body.className = 'card-body';

  const name = document.createElement('h3');
  name.className = 'card-title';
  name.setAttribute('data-testid', 'product-name');
  name.textContent = product.name;
  body.appendChild(name);

  const price = document.createElement('p');
  price.className = 'card-price';
  price.setAttribute('data-testid', 'product-price');
  price.textContent = formatCurrency(product.price);
  body.appendChild(price);

  const rating = document.createElement('div');
  rating.className = 'card-rating';
  rating.setAttribute('data-testid', 'product-rating');
  const fullStars = Math.floor(product.rating);
  const hasHalf = product.rating - fullStars >= 0.5;
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '\u2605';
  if (hasHalf) stars += '\u00BD';
  for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) stars += '\u2606';
  rating.textContent = `${stars} (${product.rating})`;
  body.appendChild(rating);

  const stock = document.createElement('span');
  stock.className = product.stock > 0 ? 'stock in-stock' : 'stock out-of-stock';
  stock.setAttribute('data-testid', 'product-stock');
  stock.textContent = product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock';
  body.appendChild(stock);

  if (onAddToCart) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.setAttribute('data-testid', `add-to-cart-${product.id}`);
    btn.textContent = 'Add to Cart';
    btn.disabled = product.stock <= 0;
    btn.addEventListener('click', () => onAddToCart(product));
    body.appendChild(btn);
  }

  card.appendChild(body);
  return card;
}
