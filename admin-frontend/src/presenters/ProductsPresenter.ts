
import { productApi, categoryApi } from '../services/api';
import { ProductsView, ProductsPresenter, ProductsState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class ProductsPresenterImpl extends BasePresenterImpl<ProductsView> implements ProductsPresenter {
  private state: ProductsState = {
    products: [],
    categories: [],
    loading: false,
    error: '',
    searchTerm: '',
    sortField: 'id',
    sortOrder: 'desc',
    statusFilter: 'all',
    categoryFilter: 'all'
  };

  attachView(view: ProductsView): void {
    super.attachView(view);
  }

  loadProducts(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const params = new URLSearchParams();
    params.append('sortField', this.state.sortField);
    params.append('sortOrder', this.state.sortOrder);

    if (this.state.statusFilter !== 'all') {
      params.append('status', this.state.statusFilter);
    }
    if (this.state.categoryFilter !== 'all') {
      params.append('categoryId', this.state.categoryFilter);
    }
    if (this.state.searchTerm) {
      params.append('search', this.state.searchTerm);
    }

    productApi.getAllWithFilters(params.toString())
      .then(response => {
        if (response.success && response.data) {
          this.state.products = response.data;
          this.state.error = '';
          this.getView()?.showProducts(response.data);
        } else {
          this.state.error = response.error || '获取商品列表失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取商品列表失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  loadCategories(): void {
    categoryApi.getAll()
      .then(response => {
        if (response.success && response.data) {
          this.state.categories = response.data;
          this.getView()?.showCategories(response.data);
        }
      })
      .catch((err: any) => {
        console.error('Error fetching categories:', err);
      });
  }

  searchProducts(searchTerm: string): void {
    this.state.searchTerm = searchTerm;
    this.loadProducts();
  }

  filterByStatus(status: string): void {
    this.state.statusFilter = status;
    this.loadProducts();
  }

  filterByCategory(categoryId: string): void {
    this.state.categoryFilter = categoryId;
    this.loadProducts();
  }

  sortProducts(sortField: string, sortOrder: 'asc' | 'desc'): void {
    this.state.sortField = sortField;
    this.state.sortOrder = sortOrder;
    this.loadProducts();
  }

  deleteProduct(id: number): void {
    productApi.delete(id)
      .then(response => {
        if (response.success) {
          this.getView()?.showDeleteSuccess();
          this.loadProducts();
        } else {
          this.getView()?.showDeleteError(response.error || '删除失败');
        }
      })
      .catch((err: any) => {
        this.getView()?.showDeleteError('删除商品失败');
      });
  }

  resetFilters(): void {
    this.state.searchTerm = '';
    this.state.sortField = 'id';
    this.state.sortOrder = 'desc';
    this.state.statusFilter = 'all';
    this.state.categoryFilter = 'all';
    this.loadProducts();
  }

  onSearchTermChange(term: string): void {
    this.state.searchTerm = term;
  }

  onStatusFilterChange(status: string): void {
    this.state.statusFilter = status;
    this.loadProducts();
  }

  onCategoryFilterChange(categoryId: string): void {
    this.state.categoryFilter = categoryId;
    this.loadProducts();
  }

  onSortFieldChange(field: string): void {
    if (this.state.sortField === field) {
      this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortField = field;
      this.state.sortOrder = 'asc';
    }
    this.loadProducts();
  }

  getCurrentState(): ProductsState {
    return { ...this.state };
  }
}

export const productsPresenter = new ProductsPresenterImpl();