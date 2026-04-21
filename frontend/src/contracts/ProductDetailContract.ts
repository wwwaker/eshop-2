import { Product } from '../types';

export interface ProductDetailView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showProduct(product: Product): void;
  showAddToCartSuccess(): void;
  showAddToCartError(message: string): void;
  navigateToLogin(): void;
  updateQuantity(quantity: number): void;
}

export interface ProductDetailPresenter {
  attachView(view: ProductDetailView): void;
  detachView(): void;
  loadProduct(productId: number): void;
  addToCart(userId: number, productId: number, quantity: number): void;
  onQuantityChange(quantity: number): void;
  getCurrentState(): ProductDetailState;
}

export interface ProductDetailState {
  product: Product | null;
  loading: boolean;
  error: string;
  quantity: number;
  message: string;
  imageError: boolean;
}