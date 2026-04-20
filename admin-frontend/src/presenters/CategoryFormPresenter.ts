import { Category } from '../types';
import { categoryApi } from '../services/api';
import { CategoryFormView, CategoryFormPresenter, CategoryFormState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class CategoryFormPresenterImpl extends BasePresenterImpl<CategoryFormView> implements CategoryFormPresenter {
  private state: CategoryFormState = {
    category: null,
    loading: false,
    error: '',
    success: ''
  };

  attachView(view: CategoryFormView): void {
    super.attachView(view);
  }

  loadCategory(id: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    categoryApi.getById(id)
      .then(response => {
        if (response.success && response.data) {
          this.state.category = response.data;
          this.state.error = '';
          this.getView()?.showCategory(response.data);
        } else {
          this.state.error = '获取分类信息失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取分类信息失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  saveCategory(category: Category): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateCategory(category);
    if (validationErrors.length > 0) {
      this.getView()?.showError(validationErrors.join('\n'));
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    categoryApi.create(category)
      .then(response => {
        if (response.success) {
          this.state.success = '分类创建成功';
          this.getView()?.showSuccess('分类创建成功');
          setTimeout(() => {
            this.getView()?.navigateToCategories();
          }, 1000);
        } else {
          this.state.error = response.error || '分类创建失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '分类创建失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  updateCategory(id: number, category: Category): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateCategory(category);
    if (validationErrors.length > 0) {
      this.getView()?.showError(validationErrors.join('\n'));
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    categoryApi.update({ ...category, id })
      .then(response => {
        if (response.success) {
          this.state.success = '分类更新成功';
          this.getView()?.showSuccess('分类更新成功');
          setTimeout(() => {
            this.getView()?.navigateToCategories();
          }, 1000);
        } else {
          this.state.error = response.error || '分类更新失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '分类更新失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  validateCategory(category: Category): string[] {
    const errors: string[] = [];
    
    if (!category.name || category.name.trim() === '') {
      errors.push('分类名称不能为空');
    }
    
    if (category.name && category.name.length > 50) {
      errors.push('分类名称不能超过50个字符');
    }
    
    if (category.description && category.description.length > 200) {
      errors.push('分类描述不能超过200个字符');
    }
    
    return errors;
  }

  resetForm(): void {
    this.state.category = null;
    this.state.error = '';
    this.state.success = '';
  }
}

export const categoryFormPresenter = new CategoryFormPresenterImpl();