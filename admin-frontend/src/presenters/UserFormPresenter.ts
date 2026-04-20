import { User } from '../types';
import { userApi } from '../services/api';
import { UserFormView, UserFormPresenter, UserFormState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class UserFormPresenterImpl extends BasePresenterImpl<UserFormView> implements UserFormPresenter {
  private state: UserFormState = {
    user: null,
    loading: false,
    error: '',
    success: ''
  };

  attachView(view: UserFormView): void {
    super.attachView(view);
  }

  loadUser(id: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    userApi.getById(id)
      .then(response => {
        if (response.success && response.data) {
          this.state.user = response.data;
          this.state.error = '';
          this.getView()?.showUser(response.data);
        } else {
          this.state.error = '获取用户信息失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取用户信息失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  saveUser(user: User): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateUser(user);
    if (validationErrors.length > 0) {
      this.getView()?.showError(validationErrors.join('\n'));
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    userApi.create(user)
      .then(response => {
        if (response.success) {
          this.state.success = '用户创建成功';
          this.getView()?.showSuccess('用户创建成功');
          setTimeout(() => {
            this.getView()?.navigateToUsers();
          }, 1000);
        } else {
          this.state.error = response.error || '用户创建失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '用户创建失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  updateUser(id: number, user: User): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateUser(user);
    if (validationErrors.length > 0) {
      this.getView()?.showError(validationErrors.join('\n'));
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    userApi.update(user)
      .then(response => {
        if (response.success) {
          this.state.success = '用户更新成功';
          this.getView()?.showSuccess('用户更新成功');
          setTimeout(() => {
            this.getView()?.navigateToUsers();
          }, 1000);
        } else {
          this.state.error = response.error || '用户更新失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '用户更新失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  validateUser(user: User): string[] {
    const errors: string[] = [];
    
    if (!user.username || user.username.trim() === '') {
      errors.push('用户名不能为空');
    }
    
    if (user.username && user.username.length < 3) {
      errors.push('用户名不能少于3个字符');
    }
    
    if (user.username && user.username.length > 20) {
      errors.push('用户名不能超过20个字符');
    }
    
    if (!user.password || user.password.trim() === '') {
      errors.push('密码不能为空');
    }
    
    if (user.password && user.password.length < 6) {
      errors.push('密码不能少于6个字符');
    }
    
    if (!user.email || user.email.trim() === '') {
      errors.push('邮箱不能为空');
    }
    
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push('邮箱格式不正确');
    }
    
    if (!user.role || user.role.trim() === '') {
      errors.push('角色不能为空');
    }
    
    return errors;
  }

  resetForm(): void {
    this.state.user = null;
    this.state.error = '';
    this.state.success = '';
  }
}

export const userFormPresenter = new UserFormPresenterImpl();