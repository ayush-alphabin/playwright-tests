import { CartService } from '../services/cart-service';
import { formatCurrency } from '../utils/formatting';

export function renderCart(
  container: HTMLElement,
  cartService: CartService,
  updateBadge: () => void
): void {
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Shopping Cart';
  container.appendChild(heading);

  if (cartService.isEmpty()) {
    const empty = document.createElement('div');
    empty.setAttribute('data-testid', 'empty-cart');
    empty.className = 'empty-cart';
    empty.innerHTML = '<p>Your cart is empty.</p><a href="#/products" class="btn btn-primary">Browse Products</a>';
    container.appendChild(empty);
    return;
  }

  function rerender(): void {
    renderCart(container, cartService, updateBadge);
    updateBadge();
  }

  // Cart items table
  const table = document.createElement('table');
  table.className = 'cart-table';
  table.setAttribute('data-testid', 'cart-table');

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const item of cartService.getItems()) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = item.product.name;
    row.appendChild(nameCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = formatCurrency(item.product.price);
    row.appendChild(priceCell);

    const qtyCell = document.createElement('td');
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '1';
    qtyInput.max = String(item.product.stock);
    qtyInput.value = String(item.quantity);
    qtyInput.setAttribute('data-testid', `qty-${item.product.id}`);
    qtyInput.addEventListener('change', () => {
      const newQty = parseInt(qtyInput.value, 10);
      if (newQty > 0) {
        cartService.updateQuantity(item.product.id, newQty);
      } else {
        cartService.removeItem(item.product.id);
      }
      rerender();
    });
    qtyCell.appendChild(qtyInput);
    row.appendChild(qtyCell);

    const totalCell = document.createElement('td');
    totalCell.textContent = formatCurrency(item.product.price * item.quantity);
    row.appendChild(totalCell);

    const actionCell = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger';
    removeBtn.setAttribute('data-testid', `remove-${item.product.id}`);
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      cartService.removeItem(item.product.id);
      rerender();
    });
    actionCell.appendChild(removeBtn);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  container.appendChild(table);

  // Discount section
  const discountSection = document.createElement('div');
  discountSection.className = 'discount-section';

  const discountInput = document.createElement('input');
  discountInput.type = 'text';
  discountInput.placeholder = 'Discount code';
  discountInput.setAttribute('data-testid', 'discount-input');
  discountSection.appendChild(discountInput);

  const applyBtn = document.createElement('button');
  applyBtn.className = 'btn btn-secondary';
  applyBtn.setAttribute('data-testid', 'apply-discount');
  applyBtn.textContent = 'Apply';

  const discountMsg = document.createElement('div');
  discountMsg.setAttribute('data-testid', 'discount-message');
  discountMsg.className = 'discount-message';

  applyBtn.addEventListener('click', () => {
    const code = discountInput.value.trim();
    if (!code) {
      discountMsg.textContent = 'Please enter a discount code.';
      discountMsg.className = 'discount-message error';
      return;
    }
    const result = cartService.applyDiscount(code);
    if (result.success) {
      discountMsg.textContent = `Discount applied! You save ${formatCurrency(result.discount)}.`;
      discountMsg.className = 'discount-message success';
    } else {
      discountMsg.textContent = result.error || 'Invalid discount code.';
      discountMsg.className = 'discount-message error';
    }
  });

  discountSection.appendChild(applyBtn);
  discountSection.appendChild(discountMsg);
  container.appendChild(discountSection);

  // Summary
  const summary = document.createElement('div');
  summary.className = 'cart-summary';

  const subtotal = document.createElement('div');
  subtotal.setAttribute('data-testid', 'subtotal');
  subtotal.innerHTML = `<span>Subtotal:</span> <span>${formatCurrency(cartService.getSubtotal())}</span>`;
  summary.appendChild(subtotal);

  const tax = document.createElement('div');
  tax.setAttribute('data-testid', 'tax');
  tax.innerHTML = `<span>Tax:</span> <span>${formatCurrency(cartService.getTax())}</span>`;
  summary.appendChild(tax);

  const shipping = document.createElement('div');
  shipping.setAttribute('data-testid', 'shipping');
  const shippingAmount = cartService.getShipping();
  shipping.innerHTML = `<span>Shipping:</span> <span>${shippingAmount === 0 ? 'FREE' : formatCurrency(shippingAmount)}</span>`;
  summary.appendChild(shipping);

  const total = document.createElement('div');
  total.className = 'cart-total';
  total.setAttribute('data-testid', 'total');
  total.innerHTML = `<span>Total:</span> <span>${formatCurrency(cartService.getTotal())}</span>`;
  summary.appendChild(total);

  container.appendChild(summary);

  // Checkout link
  const checkoutLink = document.createElement('a');
  checkoutLink.href = '#/checkout';
  checkoutLink.className = 'btn btn-primary checkout-btn';
  checkoutLink.textContent = 'Proceed to Checkout';
  container.appendChild(checkoutLink);
}
