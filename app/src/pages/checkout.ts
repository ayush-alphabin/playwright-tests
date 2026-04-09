import { CartService } from '../services/cart-service';
import { formatCurrency } from '../utils/formatting';
import { validateZipCode, validateCreditCard } from '../utils/validation';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
];

export function renderCheckout(
  container: HTMLElement,
  cartService: CartService
): void {
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Checkout';
  container.appendChild(heading);

  if (cartService.isEmpty()) {
    const msg = document.createElement('p');
    msg.textContent = 'Your cart is empty. Add some items before checking out.';
    container.appendChild(msg);

    const link = document.createElement('a');
    link.href = '#/products';
    link.className = 'btn btn-primary';
    link.textContent = 'Browse Products';
    container.appendChild(link);
    return;
  }

  // Order summary
  const summarySection = document.createElement('section');
  summarySection.className = 'order-summary';

  const summaryTitle = document.createElement('h2');
  summaryTitle.textContent = 'Order Summary';
  summarySection.appendChild(summaryTitle);

  const itemsList = document.createElement('ul');
  for (const item of cartService.getItems()) {
    const li = document.createElement('li');
    li.textContent = `${item.product.name} x${item.quantity} - ${formatCurrency(item.product.price * item.quantity)}`;
    itemsList.appendChild(li);
  }
  summarySection.appendChild(itemsList);

  const totalLine = document.createElement('p');
  totalLine.className = 'order-total';
  totalLine.innerHTML = `<strong>Total: ${formatCurrency(cartService.getTotal())}</strong>`;
  summarySection.appendChild(totalLine);

  container.appendChild(summarySection);

  // Checkout form
  const form = document.createElement('form');
  form.className = 'checkout-form';
  form.addEventListener('submit', (e) => e.preventDefault());

  // Shipping address section
  const shipSection = document.createElement('fieldset');
  const shipLegend = document.createElement('legend');
  shipLegend.textContent = 'Shipping Address';
  shipSection.appendChild(shipLegend);

  const shipName = createField('Full Name', 'text', 'ship-name', shipSection);
  const shipAddress = createField('Address', 'text', 'ship-address', shipSection);
  const shipCity = createField('City', 'text', 'ship-city', shipSection);
  const shipZip = createField('ZIP / Postal Code', 'text', 'ship-zip', shipSection);

  // Country select
  const countryGroup = document.createElement('div');
  countryGroup.className = 'form-group';
  const countryLabel = document.createElement('label');
  countryLabel.textContent = 'Country';
  countryGroup.appendChild(countryLabel);

  const countrySelect = document.createElement('select');
  countrySelect.setAttribute('data-testid', 'ship-country');
  for (const c of COUNTRIES) {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.name;
    countrySelect.appendChild(opt);
  }
  countryGroup.appendChild(countrySelect);

  const countryError = document.createElement('div');
  countryError.className = 'field-error';
  countryGroup.appendChild(countryError);
  shipSection.appendChild(countryGroup);

  form.appendChild(shipSection);

  // Payment section
  const paySection = document.createElement('fieldset');
  const payLegend = document.createElement('legend');
  payLegend.textContent = 'Payment Information';
  paySection.appendChild(payLegend);

  const cardNumber = createField('Card Number', 'text', 'card-number', paySection);
  const cardExpiry = createField('Expiry (MM/YY)', 'text', 'card-expiry', paySection);
  const cardCvv = createField('CVV', 'text', 'card-cvv', paySection);

  form.appendChild(paySection);

  // Place order button
  const placeOrderBtn = document.createElement('button');
  placeOrderBtn.type = 'submit';
  placeOrderBtn.className = 'btn btn-primary';
  placeOrderBtn.setAttribute('data-testid', 'place-order');
  placeOrderBtn.textContent = 'Place Order';

  placeOrderBtn.addEventListener('click', () => {
    clearAllErrors(form);

    let hasErrors = false;

    // Validate required shipping fields
    if (!shipName.input.value.trim()) {
      showFieldError(shipName.error, 'Name is required');
      hasErrors = true;
    }
    if (!shipAddress.input.value.trim()) {
      showFieldError(shipAddress.error, 'Address is required');
      hasErrors = true;
    }
    if (!shipCity.input.value.trim()) {
      showFieldError(shipCity.error, 'City is required');
      hasErrors = true;
    }

    // Validate zip code
    const zipResult = validateZipCode(shipZip.input.value.trim(), countrySelect.value);
    if (!shipZip.input.value.trim()) {
      showFieldError(shipZip.error, 'ZIP code is required');
      hasErrors = true;
    } else if (!zipResult.valid) {
      showFieldError(shipZip.error, zipResult.error || 'Invalid ZIP code');
      hasErrors = true;
    }

    // Validate card number
    if (!cardNumber.input.value.trim()) {
      showFieldError(cardNumber.error, 'Card number is required');
      hasErrors = true;
    } else {
      const cardResult = validateCreditCard(cardNumber.input.value.trim());
      if (!cardResult.valid) {
        showFieldError(cardNumber.error, cardResult.error || 'Invalid card number');
        hasErrors = true;
      }
    }

    // Validate expiry
    if (!cardExpiry.input.value.trim()) {
      showFieldError(cardExpiry.error, 'Expiry date is required');
      hasErrors = true;
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry.input.value.trim())) {
      showFieldError(cardExpiry.error, 'Use MM/YY format');
      hasErrors = true;
    }

    // Validate CVV
    if (!cardCvv.input.value.trim()) {
      showFieldError(cardCvv.error, 'CVV is required');
      hasErrors = true;
    } else if (!/^\d{3,4}$/.test(cardCvv.input.value.trim())) {
      showFieldError(cardCvv.error, 'CVV must be 3 or 4 digits');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Success — show confirmation
    const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();
    cartService.clear();

    container.innerHTML = '';
    const confirmation = document.createElement('div');
    confirmation.setAttribute('data-testid', 'order-confirmation');
    confirmation.className = 'order-confirmation';

    const confirmTitle = document.createElement('h2');
    confirmTitle.textContent = 'Order Confirmed!';
    confirmation.appendChild(confirmTitle);

    const orderNumEl = document.createElement('p');
    orderNumEl.textContent = `Order Number: ${orderNumber}`;
    confirmation.appendChild(orderNumEl);

    const thankYou = document.createElement('p');
    thankYou.textContent = 'Thank you for your purchase. You will receive a confirmation email shortly.';
    confirmation.appendChild(thankYou);

    const homeLink = document.createElement('a');
    homeLink.href = '#/';
    homeLink.className = 'btn btn-primary';
    homeLink.textContent = 'Continue Shopping';
    confirmation.appendChild(homeLink);

    container.appendChild(confirmation);
  });

  form.appendChild(placeOrderBtn);
  container.appendChild(form);
}

interface FieldRefs {
  input: HTMLInputElement;
  error: HTMLDivElement;
}

function createField(
  label: string,
  type: string,
  testId: string,
  parent: HTMLElement
): FieldRefs {
  const group = document.createElement('div');
  group.className = 'form-group';

  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  group.appendChild(labelEl);

  const input = document.createElement('input');
  input.type = type;
  input.setAttribute('data-testid', testId);
  group.appendChild(input);

  const error = document.createElement('div');
  error.className = 'field-error';
  group.appendChild(error);

  parent.appendChild(group);
  return { input, error };
}

function showFieldError(el: HTMLDivElement, message: string): void {
  el.textContent = message;
  el.className = 'field-error visible';
}

function clearAllErrors(form: HTMLFormElement): void {
  for (const el of form.querySelectorAll('.field-error')) {
    el.textContent = '';
    el.className = 'field-error';
  }
}
