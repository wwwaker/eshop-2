import { cartApi, orderApi } from '../services/api';
import { CartView, CartPresenter, CartState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class CartPresenterImpl extends BasePresenterImpl<CartView> implements CartPresenter {
  private state: CartState = {
    cartItems: [],
    loading: false,
    error: '',
    total: 0,
    message: '',
    checkoutLoading: false,
    imageErrors: {}
  };

  attachView(view: CartView): void {
    super.attachView(view);
  }

  loadCartItems(userId: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    Promise.all([
      cartApi.getItems(userId),
      cartApi.getTotal(userId)
    ])
      .then(([items, total]: [any, any]) => {
        this.state.cartItems = items;
        this.state.total = total;
        this.state.error = '';
        this.getView()?.showCartItems(items);
        this.getView()?.showTotal(total);
      })
      .catch((err: any) => {
        this.state.error = '加载购物车失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  updateQuantity(cartItemId: number, userId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(cartItemId, userId);
      return;
    }

    cartApi.updateQuantity(cartItemId, newQuantity)
      .then(() => {
        this.loadCartItems(userId);
      })
      .catch((err: any) => {
        this.getView()?.showMessage('更新失败', true);
      });
  }

  removeItem(cartItemId: number, userId: number): void {
    cartApi.removeItem(cartItemId)
      .then(() => {
        this.loadCartItems(userId);
      })
      .catch((err: any) => {
        this.getView()?.showMessage('删除失败', true);
      });
  }

  clearCart(userId: number): void {
    cartApi.clearCart(userId)
      .then(() => {
        this.state.cartItems = [];
        this.state.total = 0;
        this.getView()?.showCartItems([]);
        this.getView()?.showTotal(0);
      })
      .catch((err: any) => {
        this.getView()?.showMessage('清空失败', true);
      });
  }

  checkout(userId: number, receiverName: string, receiverPhone: string, receiverAddress: string): void {
    this.state.checkoutLoading = true;

    orderApi.create(userId, receiverName, receiverPhone, receiverAddress)
      .then((order: any) => {
        this.getView()?.showMessage('订单创建成功', false);
        this.loadCartItems(userId);
        setTimeout(() => {
          this.getView()?.navigateToOrder(order.id);
        }, 1000);
      })
      .catch((err: any) => {
        this.getView()?.showMessage(err.response?.data?.error || '结账失败', true);
      })
      .finally(() => {
        this.state.checkoutLoading = false;
      });
  }

  onQuantityChange(cartItemId: number, newQuantity: number): void {
    // This is handled in the view
  }

  onImageError(productId: number): void {
    this.state.imageErrors[productId] = true;
    this.getView()?.showImageError(productId);
  }

  getCurrentState(): CartState {
    return { ...this.state };
  }
}

export const cartPresenter = new CartPresenterImpl();