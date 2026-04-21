import { User } from '../types';

export interface ProfileView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  showUser(user: User): void;
  updateFormData(data: {
    email: string;
    phone: string;
    address: string;
  }): void;
}

export interface ProfilePresenter {
  attachView(view: ProfileView): void;
  detachView(): void;
  loadProfile(userId: number): void;
  updateProfile(userId: number, userData: { email: string; phone: string; address: string }): void;
  validateProfile(userData: { email: string; phone: string; address: string }): string[];
  getCurrentState(): ProfileState;
}

export interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string;
  success: string;
  email: string;
  phone: string;
  address: string;
}