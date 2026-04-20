import { User } from '../types';

export interface UserFormView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  showUser(user: User): void;
  navigateToUsers(): void;
  updateFormData(data: User): void;
}

export interface UserFormPresenter {
  attachView(view: UserFormView): void;
  detachView(): void;
  loadUser(id: number): void;
  saveUser(user: User): void;
  updateUser(id: number, user: User): void;
  validateUser(user: User): string[];
  resetForm(): void;
}

export interface UserFormState {
  user: User | null;
  loading: boolean;
  error: string;
  success: string;
}