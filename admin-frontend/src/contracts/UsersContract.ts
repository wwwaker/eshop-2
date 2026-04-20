import { User } from '../types';

export interface UsersView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showUsers(users: User[]): void;
  showDeleteSuccess(): void;
  showDeleteError(message: string): void;
  refreshUsers(): void;
  showTotalElements(total: number): void;
}

export interface UsersPresenter {
  attachView(view: UsersView): void;
  detachView(): void;
  loadUsers(): void;
  searchUsers(searchTerm: string): void;
  filterByRole(role: string): void;
  sortUsers(sortField: string, sortOrder: 'asc' | 'desc'): void;
  deleteUser(id: number): void;
  resetFilters(): void;
  onSearchTermChange(term: string): void;
  onRoleFilterChange(role: string): void;
  onSortFieldChange(field: string): void;
  onPageChange(page: number): void;
  onPageSizeChange(size: number): void;
  getCurrentState(): UsersState;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string;
  searchTerm: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  roleFilter: string;
  currentPage: number;
  pageSize: number;
  totalElements: number;
}