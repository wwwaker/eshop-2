import { userApi } from '../services/api';
import { ProfileView, ProfilePresenter, ProfileState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class ProfilePresenterImpl extends BasePresenterImpl<ProfileView> implements ProfilePresenter {
  private state: ProfileState = {
    user: null,
    loading: false,
    error: '',
    success: '',
    email: '',
    phone: '',
    address: ''
  };

  attachView(view: ProfileView): void {
    super.attachView(view);
  }

  loadProfile(userId: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    userApi.updateProfile({ id: userId } as any)
      .then((response: any) => {
        // For profile loading, we just show the user data from context
      })
      .catch((err: any) => {
        this.state.error = '加载个人信息失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  updateProfile(userId: number, userData: { email: string; phone: string; address: string }): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    userApi.updateProfile({ id: userId, ...userData })
      .then((response: any) => {
        if (response.success) {
          this.state.success = '个人信息更新成功';
          this.state.error = '';
          this.getView()?.showSuccess(this.state.success);
        } else {
          this.state.error = response.error || '更新失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = err.response?.data?.error || '更新失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  validateProfile(userData: { email: string; phone: string; address: string }): string[] {
    const errors: string[] = [];

    if (!userData.email || userData.email.trim() === '') {
      errors.push('邮箱不能为空');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('邮箱格式不正确');
    }

    if (!userData.phone || userData.phone.trim() === '') {
      errors.push('手机号不能为空');
    }

    return errors;
  }

  getCurrentState(): ProfileState {
    return { ...this.state };
  }
}

export const profilePresenter = new ProfilePresenterImpl();