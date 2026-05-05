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
    code: string;
  }): void;
}

export interface RegisterPresenter {
  attachView(view: RegisterView): void;
  detachView(): void;
  register(userData: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    address: string;
    code: string;
  }): void;
  validateRegister(userData: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    address: string;
    code: string;
  }): string[];
  sendCode(email: string, onCountdownTick: (seconds: number) => void, onDone: () => void): void;
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
  code: string;
}