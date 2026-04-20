
import { userApi } from '../services/api';
import { UsersView, UsersPresenter, UsersState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class UsersPresenterImpl extends BasePresenterImpl<UsersView> implements UsersPresenter {
  private state: UsersState = {
    users: [],
    loading: false,
    error: '',
    searchTerm: '',
    sortField: 'id',
    sortOrder: 'desc',
    roleFilter: 'all',
    currentPage: 1,
    pageSize: 20,
    totalElements: 0
  };

  attachView(view: UsersView): void {
    super.attachView(view);
  }

  loadUsers(): void {
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
    if (this.state.roleFilter !== 'all') {
      params.append('role', this.state.roleFilter);
    }

    userApi.getAllWithFilters(params.toString())
      .then(response => {
        if (response.success && response.data) {
          const data = response.data;
          if (typeof data === 'object' && data !== null && 'content' in data && Array.isArray(data.content)) {
            const paginationData = data as unknown as { content: any[]; totalElements: number };
            this.state.users = paginationData.content;
            this.state.totalElements = paginationData.totalElements || 0;
            this.getView()?.showUsers(paginationData.content);
            this.getView()?.showTotalElements(paginationData.totalElements || 0);
          } else if (Array.isArray(data)) {
            this.state.users = data;
            this.state.totalElements = data.length;
            this.getView()?.showUsers(data);
            this.getView()?.showTotalElements(data.length);
          }
          this.state.error = '';
        } else {
          this.state.error = response.error || '获取用户列表失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取用户列表失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  searchUsers(searchTerm: string): void {
    this.state.searchTerm = searchTerm;
    this.state.currentPage = 1;
    this.loadUsers();
  }

  filterByRole(role: string): void {
    this.state.roleFilter = role;
    this.state.currentPage = 1;
    this.loadUsers();
  }

  sortUsers(sortField: string, sortOrder: 'asc' | 'desc'): void {
    this.state.sortField = sortField;
    this.state.sortOrder = sortOrder;
    this.loadUsers();
  }

  deleteUser(id: number): void {
    userApi.delete(id)
      .then(response => {
        if (response.success) {
          this.getView()?.showDeleteSuccess();
          this.loadUsers();
        } else {
          this.getView()?.showDeleteError(response.error || '删除失败');
        }
      })
      .catch((err: any) => {
        this.getView()?.showDeleteError('删除用户失败');
      });
  }

  resetFilters(): void {
    this.state.searchTerm = '';
    this.state.sortField = 'id';
    this.state.sortOrder = 'desc';
    this.state.roleFilter = 'all';
    this.state.currentPage = 1;
    this.loadUsers();
  }

  onSearchTermChange(term: string): void {
    this.state.searchTerm = term;
  }

  onRoleFilterChange(role: string): void {
    this.state.roleFilter = role;
    this.state.currentPage = 1;
    this.loadUsers();
  }

  onSortFieldChange(field: string): void {
    if (this.state.sortField === field) {
      this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortField = field;
      this.state.sortOrder = 'asc';
    }
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.state.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(size: number): void {
    this.state.pageSize = size;
    this.state.currentPage = 1;
    this.loadUsers();
  }

  getCurrentState(): UsersState {
    return { ...this.state };
  }
}

export const usersPresenter = new UsersPresenterImpl();