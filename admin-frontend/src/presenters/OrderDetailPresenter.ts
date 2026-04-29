import { orderApi } from '../services/api';
import { OrderDetailView, OrderDetailPresenter, OrderDetailState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class OrderDetailPresenterImpl extends BasePresenterImpl<OrderDetailView> implements OrderDetailPresenter {
  private state: OrderDetailState = {
    order: null,
    loading: false,
    error: '',
    imageErrors: {}
  };

  attachView(view: OrderDetailView): void {
    super.attachView(view);
  }

  loadOrder(id: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    orderApi.getById(id)
      .then(response => {
        if (response.success && response.data) {
          this.state.order = response.data;
          this.state.error = '';
          this.getView()?.showOrder(response.data);
        } else {
          this.state.error = '获取订单详情失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取订单详情失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  handleImageError(productId: number): void {
    this.state.imageErrors = { ...this.state.imageErrors, [productId]: true };
    this.getView()?.updateImageErrors(this.state.imageErrors);
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
          this.loadOrder(orderId);
        } else {
          this.getView()?.showError(response.error || '发货失败');
        }
      })
      .catch((err: any) => {
        this.getView()?.showError('发货失败');
      });
  }
}

export const orderDetailPresenter = new OrderDetailPresenterImpl();