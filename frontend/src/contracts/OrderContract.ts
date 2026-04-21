import { Order } from '../types';

export interface OrderListView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showOrders(orders: Order[]): void;
  showEmptyState(): void;
}

export interface OrderListPresenter {
  attachView(view: OrderListView): void;
  detachView(): void;
  loadOrders(userId: number): void;
  getCurrentState(): OrderListState;
}

export interface OrderListState {
  orders: Order[];
  loading: boolean;
  error: string;
}

export interface OrderDetailView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showOrder(order: Order): void;
}

export interface OrderDetailPresenter {
  attachView(view: OrderDetailView): void;
  detachView(): void;
  loadOrder(orderId: number): void;
  getCurrentState(): OrderDetailState;
}

export interface OrderDetailState {
  order: Order | null;
  loading: boolean;
  error: string;
}