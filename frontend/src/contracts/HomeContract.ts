import { Product, Category } from '../types';

export interface HomeView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showProducts(products: Product[]): void;
  showCategories(categories: Category[]): void;
  updateSearchKeyword(keyword: string): void;
  updateSelectedCategory(categoryId: number | null): void;
  showImageError(productId: number): void;
  updatePagination(page: number, totalPages: number, totalElements: number): void;
}

export interface HomePresenter {
  attachView(view: HomeView): void;
  detachView(): void;
  loadProducts(): void;
  loadCategories(): void;
  searchProducts(keyword: string): void;
  filterByCategory(categoryId: number | null): void;
  onSearchKeywordChange(keyword: string): void;
  onCategorySelect(categoryId: number | null): void;
  onPageChange(page: number): void;
  onSortChange(sortField: string, sortOrder: string): void;
  onPageSizeChange(size: number): void;
  getCurrentState(): HomeState;
}

export interface HomeState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string;
  searchKeyword: string;
  selectedCategory: number | null;
  imageErrors: Record<number, boolean>;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  sortField: string;
  sortOrder: string;
}