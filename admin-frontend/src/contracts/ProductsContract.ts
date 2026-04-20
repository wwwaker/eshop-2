import { Product, Category } from '../types';

export interface ProductsView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showProducts(products: Product[]): void;
  showCategories(categories: Category[]): void;
  showDeleteSuccess(): void;
  showDeleteError(message: string): void;
  navigateToAddProduct(): void;
  navigateToEditProduct(id: number): void;
  refreshProducts(): void;
}

export interface ProductsPresenter {
  attachView(view: ProductsView): void;
  detachView(): void;
  loadProducts(): void;
  loadCategories(): void;
  searchProducts(searchTerm: string): void;
  filterByStatus(status: string): void;
  filterByCategory(categoryId: string): void;
  sortProducts(sortField: string, sortOrder: 'asc' | 'desc'): void;
  deleteProduct(id: number): void;
  resetFilters(): void;
  onSearchTermChange(term: string): void;
  onStatusFilterChange(status: string): void;
  onCategoryFilterChange(categoryId: string): void;
  onSortFieldChange(field: string): void;
  getCurrentState(): ProductsState;
}

export interface ProductsState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string;
  searchTerm: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  statusFilter: string;
  categoryFilter: string;
}