
import { productApi, categoryApi } from '../services/api';
import { Category } from '../types';
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
    categoryFilter: 'all',
    currentPage: 1,
    pageSize: 20,
    totalElements: 0
  };

  attachView(view: ProductsView): void {
    super.attachView(view);
  }

  loadProducts(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const params = new URLSearchParams();
    params.append('page', this.state.currentPage.toString());
    params.append('size', this.state.pageSize.toString());
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
          const data = response.data;
          if (typeof data === 'object' && data !== null && 'content' in data && Array.isArray(data.content)) {
            const paginationData = data as unknown as { content: any[]; totalElements: number };
            this.state.products = paginationData.content;
            this.state.totalElements = paginationData.totalElements || 0;
            this.getView()?.showProducts(paginationData.content);
            this.getView()?.showTotalElements(paginationData.totalElements || 0);
          } else if (Array.isArray(data)) {
            this.state.products = data;
            this.state.totalElements = data.length;
            this.getView()?.showProducts(data);
            this.getView()?.showTotalElements(data.length);
          }
          this.state.error = '';
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
          const data = response.data;
          if (typeof data === 'object' && data !== null && 'content' in data && Array.isArray((data as any).content)) {
            const paginationData = data as unknown as { content: Category[]; totalElements: number };
            this.state.categories = paginationData.content;
            this.getView()?.showCategories(paginationData.content);
          } else if (Array.isArray(data)) {
            this.state.categories = data;
            this.getView()?.showCategories(data);
          }
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
    this.state.currentPage = 1;
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

  onPageChange(page: number): void {
    this.state.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(size: number): void {
    this.state.pageSize = size;
    this.state.currentPage = 1;
    this.loadProducts();
  }

  getCurrentState(): ProductsState {
    return { ...this.state };
  }
}

export const productsPresenter = new ProductsPresenterImpl();