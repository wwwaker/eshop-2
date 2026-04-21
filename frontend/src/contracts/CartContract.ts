import { CartItem } from '../types';

export interface CartView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showCartItems(items: CartItem[]): void;
  showTotal(total: number): void;
  showMessage(message: string, isError: boolean): void;
  navigateToHome(): void;
  navigateToOrder(orderId: number): void;
  showImageError(productId: number): void;
}

export interface CartPresenter {
  attachView(view: CartView): void;
  detachView(): void;
  loadCartItems(userId: number): void;
  updateQuantity(cartItemId: number, userId: number, newQuantity: number): void;
  removeItem(cartItemId: number, userId: number): void;
  clearCart(userId: number): void;
  checkout(userId: number, receiverName: string, receiverPhone: string, receiverAddress: string): void;
  onQuantityChange(cartItemId: number, newQuantity: number): void;
  getCurrentState(): CartState;
}

export interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string;
  total: number;
  message: string;
  checkoutLoading: boolean;
  imageErrors: Record<number, boolean>;
}