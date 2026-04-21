import { User } from '../types';

export interface LoginView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  navigateToHome(): void;
  navigateToRegister(): void;
  setLoggedInUser(user: User | null): void;
}

export interface LoginPresenter {
  attachView(view: LoginView): void;
  detachView(): void;
  login(username: string, password: string): void;
  validateLogin(username: string, password: string): string[];
}

export interface LoginState {
  user: User | null;
  loading: boolean;
  error: string;
  username: string;
  password: string;
}