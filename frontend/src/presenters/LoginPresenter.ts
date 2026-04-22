import { userApi } from '../services/api';
import { LoginView, LoginPresenter, LoginState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class LoginPresenterImpl extends BasePresenterImpl<LoginView> implements LoginPresenter {
  private state: LoginState = {
    user: null,
    loading: false,
    error: '',
    username: '',
    password: '',
    captcha: '',
    captchaImage: ''
  };

  attachView(view: LoginView): void {
    super.attachView(view);
  }

  login(username: string, password: string, captcha: string): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateLogin(username, password, captcha);
    if (validationErrors.length > 0) {
      this.state.error = validationErrors.join('\n');
      this.getView()?.showError(this.state.error);
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    userApi.login(username, password, captcha)
      .then((response: any) => {
        if (response) {
          this.state.user = response;
          this.state.error = '';
          localStorage.setItem('user', JSON.stringify(response));
          this.getView()?.setLoggedInUser(response);
          this.getView()?.navigateToHome();
        } else {
          this.state.error = '登录失败，请检查用户名和密码';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = err.response?.data?.error || '登录失败，请检查用户名和密码';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  validateLogin(username: string, password: string, captcha: string): string[] {
    const errors: string[] = [];

    if (!username || username.trim() === '') {
      errors.push('用户名不能为空');
    }

    if (!password || password.trim() === '') {
      errors.push('密码不能为空');
    }

    if (!captcha || captcha.trim() === '') {
      errors.push('验证码不能为空');
    }

    return errors;
  }

  loadCaptcha(): void {
    userApi.getCaptcha()
      .then((response: any) => {
        if (response.captcha) {
          this.state.captchaImage = response.captcha;
          this.getView()?.showCaptcha(response.captcha);
        }
      })
      .catch((err: any) => {
        console.error('加载验证码失败:', err);
      });
  }

  onCaptchaChange(captcha: string): void {
    this.state.captcha = captcha;
    this.getView()?.updateCaptchaInput(captcha);
  }
}

export const loginPresenter = new LoginPresenterImpl();