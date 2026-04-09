import { getItem, setItem } from '../utils/storage';
import type { Product } from './product-service';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = 'shopdemo_cart';

export class CartService {
  private items: CartItem[];

  constructor() {
    this.items = getItem<CartItem[]>(CART_KEY, []);
  }

  private save(): void {
    setItem(CART_KEY, this.items);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  addItem(product: Product, quantity: number = 1): void {
    if (quantity <= 0) return;
    if (product.stock <= 0) return;

    const existing = this.items.find((i) => i.product.id === product.id);
    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, product.stock);
      existing.quantity = newQty;
    } else {
      this.items.push({ product, quantity: Math.min(quantity, product.stock) });
    }
    this.save();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((i) => i.product.id !== productId);
    this.save();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find((i) => i.product.id === productId);
    if (item) {
      item.quantity = Math.min(quantity, item.product.stock);
      this.save();
    }
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getTax(rate: number = 0.08): number {
    return this.getSubtotal() * rate;
  }

  getShipping(): number {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 100) return 0; // free shipping over $100
    return 9.99;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShipping();
  }

  applyDiscount(code: string): { success: boolean; discount: number; error?: string } {
    const codes: Record<string, number> = {
      SAVE10: 0.10,
      SAVE20: 0.20,
      WELCOME: 0.15,
      VIP50: 0.50,
    };

    const rate = codes[code.toUpperCase()];
    if (!rate) return { success: false, discount: 0, error: 'Invalid discount code' };

    const discount = this.getSubtotal() * rate;
    return { success: true, discount };
  }

  clear(): void {
    this.items = [];
    this.save();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
