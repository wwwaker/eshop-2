import { Category } from '../types';

export interface CategoriesView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showCategories(categories: Category[]): void;
  showDeleteSuccess(): void;
  showDeleteError(message: string): void;
  refreshCategories(): void;
}

export interface CategoriesPresenter {
  attachView(view: CategoriesView): void;
  detachView(): void;
  loadCategories(): void;
  searchCategories(searchTerm: string): void;
  sortCategories(sortField: string, sortOrder: 'asc' | 'desc'): void;
  deleteCategory(id: number): void;
  resetFilters(): void;
  onSearchTermChange(term: string): void;
  onSortFieldChange(field: string): void;
  getCurrentState(): CategoriesState;
}

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string;
  searchTerm: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}