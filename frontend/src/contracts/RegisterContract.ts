export interface RegisterView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  navigateToLogin(): void;
  updateFormData(data: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    address: string;
  }): void;
}

export interface RegisterPresenter {
  attachView(view: RegisterView): void;
  detachView(): void;
  register(userData: {
    username: string;
    password: string;
    email: string;
    phone: string;
    address: string;
  }): void;
  validateRegister(userData: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    address: string;
  }): string[];
  resetForm(): void;
}

export interface RegisterState {
  loading: boolean;
  error: string;
  success: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
  address: string;
}