import { Order } from '../types';

export interface OrderDetailView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showOrder(order: Order): void;
  navigateToOrders(): void;
  updateImageErrors(errors: Record<string, boolean>): void;
}

export interface OrderDetailPresenter {
  attachView(view: OrderDetailView): void;
  detachView(): void;
  loadOrder(id: number): void;
  handleImageError(productId: number): void;
  getStatusText(status: string): string;
  getStatusColor(status: string): string;
  shipOrder(orderId: number): void;
}

export interface OrderDetailState {
  order: Order | null;
  loading: boolean;
  error: string;
  imageErrors: Record<string, boolean>;
}