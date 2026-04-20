
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
    roleFilter: 'all'
  };

  attachView(view: UsersView): void {
    super.attachView(view);
  }

  loadUsers(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const params = new URLSearchParams();
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
          this.state.users = response.data;
          this.state.error = '';
          this.getView()?.showUsers(response.data);
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
    this.loadUsers();
  }

  filterByRole(role: string): void {
    this.state.roleFilter = role;
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
    this.loadUsers();
  }

  onSearchTermChange(term: string): void {
    this.state.searchTerm = term;
  }

  onRoleFilterChange(role: string): void {
    this.state.roleFilter = role;
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

  getCurrentState(): UsersState {
    return { ...this.state };
  }
}

export const usersPresenter = new UsersPresenterImpl();