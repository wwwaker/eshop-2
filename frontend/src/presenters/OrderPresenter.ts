import { orderApi } from '../services/api';
import { OrderListView, OrderListPresenter, OrderListState, OrderDetailView, OrderDetailPresenter, OrderDetailState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class OrderListPresenterImpl extends BasePresenterImpl<OrderListView> implements OrderListPresenter {
  private state: OrderListState = {
    orders: [],
    loading: false,
    error: ''
  };

  attachView(view: OrderListView): void {
    super.attachView(view);
  }

  loadOrders(userId: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    orderApi.getUserOrders(userId)
      .then((orders: any) => {
        this.state.orders = orders;
        this.state.error = '';
        if (orders.length === 0) {
          this.getView()?.showEmptyState();
        } else {
          this.getView()?.showOrders(orders);
        }
      })
      .catch((err: any) => {
        this.state.error = '加载订单失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  getCurrentState(): OrderListState {
    return { ...this.state };
  }
}

export const orderListPresenter = new OrderListPresenterImpl();

export class OrderDetailPresenterImpl extends BasePresenterImpl<OrderDetailView> implements OrderDetailPresenter {
  private state: OrderDetailState = {
    order: null,
    loading: false,
    error: ''
  };

  attachView(view: OrderDetailView): void {
    super.attachView(view);
  }

  loadOrder(orderId: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    orderApi.getById(orderId)
      .then((order: any) => {
        this.state.order = order;
        this.state.error = '';
        this.getView()?.showOrder(order);
      })
      .catch((err: any) => {
        this.state.error = '加载订单详情失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  getCurrentState(): OrderDetailState {
    return { ...this.state };
  }
}

export const orderDetailPresenter = new OrderDetailPresenterImpl();