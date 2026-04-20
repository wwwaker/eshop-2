import { DashboardData } from '../types';
import { dashboardApi } from '../services/api';
import { DashboardView, DashboardPresenter, DashboardState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class DashboardPresenterImpl extends BasePresenterImpl<DashboardView> implements DashboardPresenter {
  private state: DashboardState = {
    dashboardData: null,
    loading: false,
    error: ''
  };

  attachView(view: DashboardView): void {
    super.attachView(view);
  }

  loadDashboardData(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    dashboardApi.getDashboardData()
      .then(response => {
        if (response.success && response.data) {
          const todaySalesObject = response.data.todaySales as any;
          const processedData: DashboardData = {
            ...response.data,
            activeUsers: {
              total: response.data.userActivity?.totalUsers || response.data.activeUsers?.total || 0,
              today: response.data.userActivity?.activeUsersToday || response.data.activeUsers?.today || 0,
              week: response.data.userActivity?.activeUsersWeek || response.data.activeUsers?.week || 0,
              month: response.data.userActivity?.activeUsersMonth || response.data.activeUsers?.month || 0
            },
            newProducts: response.data.todayNewProducts || response.data.newProducts || 0,
            todaySales: typeof todaySalesObject === 'number' ? todaySalesObject : (todaySalesObject?.todayTotalAmount || 0),
            todayOrders: todaySalesObject?.todayOrderCount || response.data.todayOrders || 0
          };
          this.state.dashboardData = processedData;
          this.state.error = '';
          this.getView()?.showDashboardData(processedData);
        } else {
          this.state.error = '加载数据失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '加载数据失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  getCurrentState(): DashboardState {
    return { ...this.state };
  }
}

export const dashboardPresenter = new DashboardPresenterImpl();