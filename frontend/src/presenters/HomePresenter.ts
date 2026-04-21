import { productApi, categoryApi } from '../services/api';
import { HomeView, HomePresenter, HomeState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';
import { PaginatedResponse, Product, Category } from '../types';

export class HomePresenterImpl extends BasePresenterImpl<HomeView> implements HomePresenter {
  private state: HomeState = {
    products: [],
    categories: [],
    loading: false,
    error: '',
    searchKeyword: '',
    selectedCategory: null,
    imageErrors: {},
    page: 1,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    sortField: 'id',
    sortOrder: 'desc'
  };

  attachView(view: HomeView): void {
    super.attachView(view);
  }

  loadProducts(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    productApi.getPaginated(
      this.state.page,
      this.state.size,
      this.state.searchKeyword,
      this.state.sortField,
      this.state.sortOrder,
      this.state.selectedCategory ?? undefined
    )
      .then((response: PaginatedResponse<Product>) => {
        this.state.products = response.content;
        this.state.totalElements = response.totalElements;
        this.state.totalPages = response.totalPages;
        this.state.error = '';
        this.getView()?.showProducts(response.content);
        this.getView()?.updatePagination(response.page, response.totalPages, response.totalElements);
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
      .then((categories: Category[]) => {
        this.state.categories = categories;
        this.getView()?.showCategories(categories);
      })
      .catch((err: any) => {
      });
  }

  searchProducts(keyword: string): void {
    this.state.searchKeyword = keyword;
    this.state.page = 1;
    this.loadProducts();
  }

  filterByCategory(categoryId: number | null): void {
    this.state.selectedCategory = categoryId;
    this.state.page = 1;
    this.loadProducts();
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

  onPageChange(page: number): void {
    this.state.page = page;
    this.loadProducts();
  }

  onSortChange(sortField: string, sortOrder: string): void {
    this.state.sortField = sortField;
    this.state.sortOrder = sortOrder;
    this.state.page = 1;
    this.loadProducts();
  }

  onPageSizeChange(size: number): void {
    this.state.size = size;
    this.state.page = 1;
    this.loadProducts();
  }

  getCurrentState(): HomeState {
    return { ...this.state };
  }
}

export const homePresenter = new HomePresenterImpl();