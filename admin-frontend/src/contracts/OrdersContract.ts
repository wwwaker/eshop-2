import { Order } from '../types';

export interface OrdersView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showOrders(orders: Order[]): void;
  refreshOrders(): void;
  showTotalElements(total: number): void;
}

export interface OrdersPresenter {
  attachView(view: OrdersView): void;
  detachView(): void;
  loadOrders(): void;
  searchOrders(searchTerm: string): void;
  filterByStatus(status: string): void;
  sortOrders(sortField: string, sortOrder: 'asc' | 'desc'): void;
  resetFilters(): void;
  onSearchTermChange(term: string): void;
  onStatusFilterChange(status: string): void;
  onSortFieldChange(field: string): void;
  onPageChange(page: number): void;
  onPageSizeChange(size: number): void;
  getCurrentState(): OrdersState;
  getStatusText(status: string): string;
  getStatusColor(status: string): string;
  shipOrder(orderId: number): void;
}

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string;
  searchTerm: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  statusFilter: string;
  currentPage: number;
  pageSize: number;
  totalElements: number;
}