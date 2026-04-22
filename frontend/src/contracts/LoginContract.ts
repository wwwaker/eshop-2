import { User } from '../types';

export interface LoginView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  navigateToHome(): void;
  navigateToRegister(): void;
  setLoggedInUser(user: User | null): void;
  showCaptcha(image: string): void;
  updateCaptchaInput(value: string): void;
}

export interface LoginPresenter {
  attachView(view: LoginView): void;
  detachView(): void;
  login(username: string, password: string, captcha: string): void;
  validateLogin(username: string, password: string, captcha: string): string[];
  loadCaptcha(): void;
  onCaptchaChange(captcha: string): void;
}

export interface LoginState {
  user: User | null;
  loading: boolean;
  error: string;
  username: string;
  password: string;
  captcha: string;
  captchaImage: string;
}