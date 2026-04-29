
import { orderApi } from '../services/api';
import { OrdersView, OrdersPresenter, OrdersState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class OrdersPresenterImpl extends BasePresenterImpl<OrdersView> implements OrdersPresenter {
  private state: OrdersState = {
    orders: [],
    loading: false,
    error: '',
    searchTerm: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
    statusFilter: 'all',
    currentPage: 1,
    pageSize: 20,
    totalElements: 0
  };

  attachView(view: OrdersView): void {
    super.attachView(view);
  }

  loadOrders(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const params = new URLSearchParams();
    params.append('page', this.state.currentPage.toString());
    params.append('size', this.state.pageSize.toString());
    params.append('sortField', this.state.sortField);
    params.append('sortOrder', this.state.sortOrder);

    if (this.state.searchTerm) {
      params.append('search', this.state.searchTerm);
    }
    if (this.state.statusFilter !== 'all') {
      params.append('status', this.state.statusFilter);
    }

    orderApi.getAllWithFilters(params.toString())
      .then(response => {
        if (response.success && response.data) {
          const data = response.data;
          if (typeof data === 'object' && data !== null && 'content' in data && Array.isArray(data.content)) {
            const paginationData = data as unknown as { content: any[]; totalElements: number };
            this.state.orders = paginationData.content;
            this.state.totalElements = paginationData.totalElements || 0;
            this.getView()?.showOrders(paginationData.content);
            this.getView()?.showTotalElements(paginationData.totalElements || 0);
          } else if (Array.isArray(data)) {
            this.state.orders = data;
            this.state.totalElements = data.length;
            this.getView()?.showOrders(data);
            this.getView()?.showTotalElements(data.length);
          }
          this.state.error = '';
        } else {
          this.state.error = response.error || '获取订单列表失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取订单列表失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  searchOrders(searchTerm: string): void {
    this.state.searchTerm = searchTerm;
    this.state.currentPage = 1;
    this.loadOrders();
  }

  filterByStatus(status: string): void {
    this.state.statusFilter = status;
    this.state.currentPage = 1;
    this.loadOrders();
  }

  sortOrders(sortField: string, sortOrder: 'asc' | 'desc'): void {
    this.state.sortField = sortField;
    this.state.sortOrder = sortOrder;
    this.loadOrders();
  }

  resetFilters(): void {
    this.state.searchTerm = '';
    this.state.sortField = 'createdAt';
    this.state.sortOrder = 'desc';
    this.state.statusFilter = 'all';
    this.state.currentPage = 1;
    this.loadOrders();
  }

  onSearchTermChange(term: string): void {
    this.state.searchTerm = term;
  }

  onStatusFilterChange(status: string): void {
    this.state.statusFilter = status;
    this.state.currentPage = 1;
    this.loadOrders();
  }

  onSortFieldChange(field: string): void {
    if (this.state.sortField === field) {
      this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortField = field;
      this.state.sortOrder = 'asc';
    }
    this.loadOrders();
  }

  onPageChange(page: number): void {
    this.state.currentPage = page;
    this.loadOrders();
  }

  onPageSizeChange(size: number): void {
    this.state.pageSize = size;
    this.state.currentPage = 1;
    this.loadOrders();
  }

  getCurrentState(): OrdersState {
    return { ...this.state };
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': '待处理',
      'PAID': '已支付',
      'SHIPPED': '已发货',
      'DELIVERED': '已送达',
      'CANCELLED': '已取消'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'PENDING': '#ffc107',
      'PAID': '#28a745',
      'SHIPPED': '#17a2b8',
      'DELIVERED': '#6c757d',
      'CANCELLED': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  }

  shipOrder(orderId: number): void {
    orderApi.shipOrder(orderId)
      .then(response => {
        if (response.success) {
          this.loadOrders();
        } else {
          this.getView()?.showError(response.error || '发货失败');
        }
      })
      .catch((err: any) => {
        this.getView()?.showError('发货失败');
      });
  }
}

export const ordersPresenter = new OrdersPresenterImpl();