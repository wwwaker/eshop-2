import { Category } from '../types';

export interface CategoryFormView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  showCategory(category: Category): void;
  navigateToCategories(): void;
  updateFormData(data: Category): void;
}

export interface CategoryFormPresenter {
  attachView(view: CategoryFormView): void;
  detachView(): void;
  loadCategory(id: number): void;
  saveCategory(category: Category): void;
  updateCategory(id: number, category: Category): void;
  validateCategory(category: Category): string[];
  resetForm(): void;
}

export interface CategoryFormState {
  category: Category | null;
  loading: boolean;
  error: string;
  success: string;
}