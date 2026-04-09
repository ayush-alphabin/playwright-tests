import { Router } from './router';
import { renderHome } from './pages/home';
import { renderProducts } from './pages/products';
import { renderCart } from './pages/cart';
import { renderLogin } from './pages/login';
import { renderCheckout } from './pages/checkout';
import { renderStress } from './pages/stress';
import { CartService } from './services/cart-service';

const app = document.getElementById('app')!;
const cartCountEl = document.getElementById('cart-count')!;
const cartService = new CartService();

// Keep cart badge in sync
function updateCartBadge() {
  cartCountEl.textContent = String(cartService.getItemCount());
}

const router = new Router(app, {
  '/': () => renderHome(app),
  '/products': () => renderProducts(app, cartService, updateCartBadge),
  '/cart': () => renderCart(app, cartService, updateCartBadge),
  '/login': () => renderLogin(app),
  '/checkout': () => renderCheckout(app, cartService),
  '/stress': () => renderStress(app),
});

router.start();
updateCartBadge();
