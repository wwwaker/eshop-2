import { User } from '../types';

export interface LoginView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  navigateToDashboard(): void;
  navigateToLogin(): void;
  updateFormData(data: { username: string; password: string }): void;
  setLoggedInUser(user: User | null): void;
}

export interface LoginPresenter {
  attachView(view: LoginView): void;
  detachView(): void;
  login(username: string, password: string): void;
  logout(): void;
  validateLogin(username: string, password: string): string[];
  resetForm(): void;
}

export interface LoginState {
  user: User | null;
  loading: boolean;
  error: string;
  success: string;
  username: string;
  password: string;
}