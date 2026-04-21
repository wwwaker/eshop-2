import { productApi, categoryApi } from '../services/api';
import { HomeView, HomePresenter, HomeState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class HomePresenterImpl extends BasePresenterImpl<HomeView> implements HomePresenter {
  private state: HomeState = {
    products: [],
    categories: [],
    loading: false,
    error: '',
    searchKeyword: '',
    selectedCategory: null,
    imageErrors: {}
  };

  attachView(view: HomeView): void {
    super.attachView(view);
  }

  loadProducts(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    productApi.getAll()
      .then((products: any) => {
        this.state.products = products;
        this.state.error = '';
        this.getView()?.showProducts(products);
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

  loadCategories(): void {
    categoryApi.getAll()
      .then((categories: any) => {
        this.state.categories = categories;
        this.getView()?.showCategories(categories);
      })
      .catch((err: any) => {
        console.error('加载分类失败:', err);
      });
  }

  searchProducts(keyword: string): void {
    if (!keyword.trim()) {
      this.loadProducts();
      return;
    }

    this.state.loading = true;
    this.getView()?.showLoading();

    productApi.search(keyword)
      .then((products: any) => {
        this.state.products = products;
        this.state.error = '';
        this.getView()?.showProducts(products);
      })
      .catch((err: any) => {
        this.state.error = '搜索失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  filterByCategory(categoryId: number | null): void {
    if (!categoryId) {
      this.loadProducts();
      return;
    }

    this.state.loading = true;
    this.getView()?.showLoading();

    productApi.getByCategory(categoryId)
      .then((products: any) => {
        this.state.products = products;
        this.state.error = '';
        this.getView()?.showProducts(products);
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

  onSearchKeywordChange(keyword: string): void {
    this.state.searchKeyword = keyword;
    this.getView()?.updateSearchKeyword(keyword);
  }

  onCategorySelect(categoryId: number | null): void {
    this.state.selectedCategory = categoryId;
    this.getView()?.updateSelectedCategory(categoryId);
  }

  onImageError(productId: number): void {
    this.state.imageErrors[productId] = true;
    this.getView()?.showImageError(productId);
  }

  getCurrentState(): HomeState {
    return { ...this.state };
  }
}

export const homePresenter = new HomePresenterImpl();