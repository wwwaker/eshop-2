// 日志管理页面的MVP架构接口定义

import { SysLog } from '../types';

export interface LogsView {
  showLoading: () => void;
  hideLoading: () => void;
  showError: (message: string) => void;
  showLogs: (logs: SysLog[]) => void;
  showTotalElements: (total: number) => void;
}

export interface LogsPresenter {
  attachView: (view: LogsView) => void;
  detachView: () => void;
  loadLogs: (page?: number, size?: number) => void;
  onFilterChange: (filters: any) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  resetFilters: () => void;
}

export interface LogsState {
  logs: SysLog[];
  loading: boolean;
  error: string;
  filters: {
    username: string;
    logLevel: string;
    search: string;
  };
  currentPage: number;
  pageSize: number;
  totalElements: number;
}