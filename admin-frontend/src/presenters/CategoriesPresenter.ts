
import { categoryApi } from '../services/api';
import { CategoriesView, CategoriesPresenter, CategoriesState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class CategoriesPresenterImpl extends BasePresenterImpl<CategoriesView> implements CategoriesPresenter {
  private state: CategoriesState = {
    categories: [],
    loading: false,
    error: '',
    searchTerm: '',
    sortField: 'id',
    sortOrder: 'desc'
  };

  attachView(view: CategoriesView): void {
    super.attachView(view);
  }

  loadCategories(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const params = new URLSearchParams();
    params.append('sortField', this.state.sortField);
    params.append('sortOrder', this.state.sortOrder);

    if (this.state.searchTerm) {
      params.append('search', this.state.searchTerm);
    }

    categoryApi.getAllWithFilters(params.toString())
      .then(response => {
        if (response.success && response.data) {
          this.state.categories = response.data;
          this.state.error = '';
          this.getView()?.showCategories(response.data);
        } else {
          this.state.error = response.error || '获取分类列表失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取分类列表失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  searchCategories(searchTerm: string): void {
    this.state.searchTerm = searchTerm;
    this.loadCategories();
  }

  sortCategories(sortField: string, sortOrder: 'asc' | 'desc'): void {
    this.state.sortField = sortField;
    this.state.sortOrder = sortOrder;
    this.loadCategories();
  }

  deleteCategory(id: number): void {
    categoryApi.delete(id)
      .then(response => {
        if (response.success) {
          this.getView()?.showDeleteSuccess();
          this.loadCategories();
        } else {
          this.getView()?.showDeleteError(response.error || '删除失败');
        }
      })
      .catch((err: any) => {
        this.getView()?.showDeleteError('删除分类失败');
      });
  }

  resetFilters(): void {
    this.state.searchTerm = '';
    this.state.sortField = 'id';
    this.state.sortOrder = 'desc';
    this.loadCategories();
  }

  onSearchTermChange(term: string): void {
    this.state.searchTerm = term;
  }

  onSortFieldChange(field: string): void {
    if (this.state.sortField === field) {
      this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortField = field;
      this.state.sortOrder = 'asc';
    }
    this.loadCategories();
  }

  getCurrentState(): CategoriesState {
    return { ...this.state };
  }
}

export const categoriesPresenter = new CategoriesPresenterImpl();