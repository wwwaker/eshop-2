import { userApi } from '../services/api';
import { RegisterView, RegisterPresenter, RegisterState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class RegisterPresenterImpl extends BasePresenterImpl<RegisterView> implements RegisterPresenter {
  private state: RegisterState = {
    loading: false,
    error: '',
    success: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    address: '',
    code: ''
  };

  attachView(view: RegisterView): void {
    super.attachView(view);
  }

  register(userData: { username: string; password: string; confirmPassword: string; email: string; phone: string; address: string; code: string }): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateRegister(userData);

    if (validationErrors.length > 0) {
      this.state.error = validationErrors.join('\n');
      this.getView()?.showError(this.state.error);
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    userApi.register({ username: userData.username, password: userData.password, email: userData.email, phone: userData.phone, address: userData.address, code: userData.code })
      .then((response: any) => {
        if (response.success) {
          this.state.success = '注册成功，即将跳转到登录页面...';
          this.getView()?.showSuccess(this.state.success);
          this.resetForm();
          setTimeout(() => {
            this.getView()?.navigateToLogin();
          }, 1500);
        } else {
          this.state.error = response.error || '注册失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = err.response?.data?.error || '注册失败，请重试';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  sendCode(email: string, onCountdownTick: (seconds: number) => void, onDone: () => void): void {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.getView()?.showError('请先输入正确的邮箱地址');
      return;
    }

    userApi.sendCode(email)
      .then(() => {
        let seconds = 60;
        onCountdownTick(seconds);
        const timer = setInterval(() => {
          seconds--;
          if (seconds <= 0) {
            clearInterval(timer);
            onDone();
          } else {
            onCountdownTick(seconds);
          }
        }, 1000);
      })
      .catch(() => {
        this.getView()?.showError('验证码发送失败，请重试');
        onDone();
      });
  }

  validateRegister(userData: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    address: string;
    code: string;
  }): string[] {
    const errors: string[] = [];

    if (!userData.username || userData.username.trim() === '') {
      errors.push('用户名不能为空');
    } else if (userData.username.length < 3 || userData.username.length > 20) {
      errors.push('用户名长度必须在3-20个字符之间');
    }

    if (!userData.password || userData.password.trim() === '') {
      errors.push('密码不能为空');
    } else if (userData.password.length < 6) {
      errors.push('密码长度至少为6位');
    }

    if (userData.password !== userData.confirmPassword) {
      errors.push('两次密码输入不一致');
    }

    if (!userData.email || userData.email.trim() === '') {
      errors.push('邮箱不能为空');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('邮箱格式不正确');
    }

    if (!userData.phone || userData.phone.trim() === '') {
      errors.push('手机号不能为空');
    }

    if (!userData.code || userData.code.trim() === '') {
      errors.push('验证码不能为空');
    }

    return errors;
  }

  resetForm(): void {
    this.state.username = '';
    this.state.password = '';
    this.state.confirmPassword = '';
    this.state.email = '';
    this.state.phone = '';
    this.state.address = '';
    this.state.code = '';
    this.state.error = '';
    this.state.success = '';
  }
}

export const registerPresenter = new RegisterPresenterImpl();