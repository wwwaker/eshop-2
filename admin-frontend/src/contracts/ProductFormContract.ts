import { Product, Category } from '../types';

export interface ProductFormView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  showCategories(categories: Category[]): void;
  showProduct(product: Product): void;
  navigateToProducts(): void;
  updateFormData(data: Product): void;
  updateCategories(categories: Category[]): void;
  showImagePreview(url: string): void;
  showImageUploadError(message: string): void;
  showImageUploadSuccess(url: string): void;
}

export interface ProductFormPresenter {
  attachView(view: ProductFormView): void;
  detachView(): void;
  loadCategories(): void;
  loadProduct(id: number): void;
  saveProduct(product: Product): void;
  updateProduct(id: number, product: Product): void;
  uploadImage(file: File): void;
  validateProduct(product: Product): string[];
  resetForm(): void;
}

export interface ProductFormState {
  product: Product | null;
  categories: Category[];
  loading: boolean;
  error: string;
  success: string;
  imageUploading: boolean;
}