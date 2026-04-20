import { User } from '../types';
import { authApi } from '../services/api';
import { LoginView, LoginPresenter, LoginState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class LoginPresenterImpl extends BasePresenterImpl<LoginView> implements LoginPresenter {
  private state: LoginState = {
    user: null,
    loading: false,
    error: '',
    success: '',
    username: '',
    password: ''
  };

  attachView(view: LoginView): void {
    super.attachView(view);
  }

  login(username: string, password: string): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateLogin(username, password);
    if (validationErrors.length > 0) {
      this.getView()?.showError(validationErrors.join('\n'));
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    authApi.login(username, password)
      .then((response: any) => {
        if (response.success && response.data) {
          this.state.user = response.data;
          this.state.error = '';
          this.state.success = '登录成功';
          this.getView()?.showSuccess('登录成功');
          this.getView()?.setLoggedInUser(response.data);
          
          // 存储用户信息到本地存储
          localStorage.setItem('user', JSON.stringify(response.data));
          
          setTimeout(() => {
            this.getView()?.navigateToDashboard();
          }, 1000);
        } else {
          this.state.error = response.error || '登录失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '登录失败，请检查用户名和密码';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  logout(): void {
    // 清除本地存储中的用户信息
    localStorage.removeItem('user');
    this.state.user = null;
    this.getView()?.setLoggedInUser(null);
    this.getView()?.navigateToLogin();
  }

  validateLogin(username: string, password: string): string[] {
    const errors: string[] = [];
    
    if (!username || username.trim() === '') {
      errors.push('用户名不能为空');
    }
    
    if (!password || password.trim() === '') {
      errors.push('密码不能为空');
    }
    
    return errors;
  }

  resetForm(): void {
    this.state.username = '';
    this.state.password = '';
    this.state.error = '';
    this.state.success = '';
  }
}

export const loginPresenter = new LoginPresenterImpl();