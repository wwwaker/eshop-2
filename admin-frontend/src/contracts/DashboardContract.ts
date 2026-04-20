import { DashboardData } from '../types';

export interface DashboardView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showDashboardData(data: DashboardData): void;
}

export interface DashboardPresenter {
  attachView(view: DashboardView): void;
  detachView(): void;
  loadDashboardData(): void;
  getCurrentState(): DashboardState;
}

export interface DashboardState {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string;
}