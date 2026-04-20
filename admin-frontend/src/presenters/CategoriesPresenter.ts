
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
    sortOrder: 'desc',
    currentPage: 1,
    pageSize: 20,
    totalElements: 0
  };

  attachView(view: CategoriesView): void {
    super.attachView(view);
  }

  loadCategories(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const params = new URLSearchParams();
    params.append('page', this.state.currentPage.toString());
    params.append('size', this.state.pageSize.toString());
    params.append('sortField', this.state.sortField);
    params.append('sortOrder', this.state.sortOrder);

    if (this.state.searchTerm) {
      params.append('search', this.state.searchTerm);
    }

    categoryApi.getAllWithFilters(params.toString())
      .then(response => {
        if (response.success && response.data) {
          const data = response.data;
          if (typeof data === 'object' && data !== null && 'content' in data && Array.isArray(data.content)) {
            const paginationData = data as unknown as { content: any[]; totalElements: number };
            this.state.categories = paginationData.content;
            this.state.totalElements = paginationData.totalElements || 0;
            this.getView()?.showCategories(paginationData.content);
            this.getView()?.showTotalElements(paginationData.totalElements || 0);
          } else if (Array.isArray(data)) {
            this.state.categories = data;
            this.state.totalElements = data.length;
            this.getView()?.showCategories(data);
            this.getView()?.showTotalElements(data.length);
          }
          this.state.error = '';
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
    this.state.currentPage = 1;
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
    this.state.currentPage = 1;
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

  onPageChange(page: number): void {
    this.state.currentPage = page;
    this.loadCategories();
  }

  onPageSizeChange(size: number): void {
    this.state.pageSize = size;
    this.state.currentPage = 1;
    this.loadCategories();
  }

  getCurrentState(): CategoriesState {
    return { ...this.state };
  }
}

export const categoriesPresenter = new CategoriesPresenterImpl();