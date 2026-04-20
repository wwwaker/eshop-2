import { LogsView, LogsPresenter, LogsState } from '../contracts/LogsContract';
import { BasePresenterImpl } from './BasePresenterImpl';
import { logApi } from '../services/api';

export class LogsPresenterImpl extends BasePresenterImpl<LogsView> implements LogsPresenter {
  private state: LogsState = {
    logs: [],
    loading: false,
    error: '',
    filters: {
      username: '',
      logLevel: 'all',
      search: ''
    },
    currentPage: 1,
    pageSize: 20,
    totalElements: 0
  };

  attachView(view: LogsView): void {
    super.attachView(view);
  }

  loadLogs(page?: number, size?: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const params = new URLSearchParams();
    params.append('page', (page || this.state.currentPage).toString());
    params.append('size', (size || this.state.pageSize).toString());

    if (this.state.filters.username) {
      params.append('username', this.state.filters.username);
    }
    if (this.state.filters.logLevel !== 'all') {
      params.append('logLevel', this.state.filters.logLevel);
    }
    if (this.state.filters.search) {
      params.append('search', this.state.filters.search);
    }

    logApi.getAllWithFilters(params.toString())
      .then(response => {
        if (response.success && response.data) {
          const data = response.data;
          if (typeof data === 'object' && data !== null && 'content' in data && Array.isArray(data.content)) {
            const paginationData = data as unknown as { content: any[]; totalElements: number };
            this.state.logs = paginationData.content;
            this.state.totalElements = paginationData.totalElements || 0;
            this.getView()?.showLogs(paginationData.content);
            this.getView()?.showTotalElements(paginationData.totalElements || 0);
          } else if (Array.isArray(data)) {
            this.state.logs = data;
            this.state.totalElements = data.length;
            this.getView()?.showLogs(data);
            this.getView()?.showTotalElements(data.length);
          }
          this.state.error = '';
        } else {
          this.state.error = response.error || '获取日志列表失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取日志列表失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  onFilterChange(filters: any): void {
    this.state.filters = {
      ...this.state.filters,
      ...filters
    };
    this.state.currentPage = 1;
    this.loadLogs();
  }

  onPageChange(page: number): void {
    this.state.currentPage = page;
    this.loadLogs();
  }

  onPageSizeChange(size: number): void {
    this.state.pageSize = size;
    this.state.currentPage = 1;
    this.loadLogs();
  }

  resetFilters(): void {
    this.state.filters = {
      username: '',
      logLevel: 'all',
      search: ''
    };
    this.state.currentPage = 1;
    this.loadLogs();
  }

  getCurrentState(): LogsState {
    return { ...this.state };
  }
}

export const logsPresenter = new LogsPresenterImpl();