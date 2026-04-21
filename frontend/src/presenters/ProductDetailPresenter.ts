import { productApi, cartApi } from '../services/api';
import { ProductDetailView, ProductDetailPresenter, ProductDetailState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class ProductDetailPresenterImpl extends BasePresenterImpl<ProductDetailView> implements ProductDetailPresenter {
  private state: ProductDetailState = {
    product: null,
    loading: false,
    error: '',
    quantity: 1,
    message: '',
    imageError: false
  };

  attachView(view: ProductDetailView): void {
    super.attachView(view);
  }

  loadProduct(productId: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    productApi.getById(productId)
      .then((product: any) => {
        this.state.product = product;
        this.state.error = '';
        this.getView()?.showProduct(product);
      })
      .catch((err: any) => {
        this.state.error = '加载商品失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  addToCart(userId: number, productId: number, quantity: number): void {
    cartApi.addItem(userId, productId, quantity)
      .then((response: any) => {
        if (response.success) {
          this.getView()?.showAddToCartSuccess();
        } else {
          this.getView()?.showAddToCartError(response.message || '添加失败');
        }
      })
      .catch((err: any) => {
        this.getView()?.showAddToCartError(err.response?.data?.error || '添加失败');
      });
  }

  onQuantityChange(quantity: number): void {
    this.state.quantity = Math.max(1, quantity);
    this.getView()?.updateQuantity(this.state.quantity);
  }

  getCurrentState(): ProductDetailState {
    return { ...this.state };
  }
}

export const productDetailPresenter = new ProductDetailPresenterImpl();