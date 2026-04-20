import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../components/Pagination';
import { SysLog } from '../types';
import { LogsView, LogsPresenter } from '../contracts/LogsContract';
import { logsPresenter } from '../presenters/LogsPresenter';
import { typography, tables, layout, alerts, inputs, buttons, colors, spacing, borders, logTables } from '../styles';

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SysLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const totalPages = Math.ceil(totalElements / pageSize);
  
  // 筛选条件
  const [filters, setFilters] = useState({
    username: '',
    logLevel: 'all',
    search: ''
  });
  
  // 列显示控制
  // 必须显示的列：ID、用户名、级别、内容、时间
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, // 必须显示
    username: true, // 必须显示
    logLevel: true, // 必须显示
    logContent: true, // 必须显示
    requestUrl: true,
    method: true,
    className: true, // 新增列
    ip: true, // 新增列
    time: true // 必须显示
  });

  const view: LogsView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showLogs: (logs: SysLog[]) => setLogs(logs),
    showTotalElements: (total: number) => setTotalElements(total)
  }), []);

  const presenter: LogsPresenter = logsPresenter;

  useEffect(() => {
    presenter.attachView(view);
    presenter.loadLogs();

    return () => {
      presenter.detachView();
    };
  }, [presenter, view]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    presenter.onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      username: '',
      logLevel: 'all',
      search: ''
    };
    setFilters(resetFilters);
    presenter.resetFilters();
  };

  // 处理列显示切换（只允许切换非必须显示的列）
  const handleColumnToggle = (column: keyof typeof visibleColumns) => {
    // 必须显示的列不允许切换
    const requiredColumns = ['id', 'username', 'logLevel', 'logContent', 'time'];
    if (!requiredColumns.includes(column)) {
      setVisibleColumns(prev => ({
        ...prev,
        [column]: !prev[column]
      }));
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={typography.h1}>系统日志</h1>

      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}

      {/* 筛选和列显示控制 */}
      <div style={layout.filterContainer}>
        <div style={{ display: 'flex', flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="搜索日志内容..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={inputs.search}
          />
          <button
            type="button"
            style={buttons.search}
            onClick={() => presenter.loadLogs()}
          >
            搜索
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>用户：</label>
          <input
            type="text"
            placeholder="用户名"
            value={filters.username}
            onChange={(e) => handleFilterChange('username', e.target.value)}
            style={inputs.select}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>级别：</label>
          <select
            value={filters.logLevel}
            onChange={(e) => handleFilterChange('logLevel', e.target.value)}
            style={inputs.select}
          >
            <option value="all">全部</option>
            <option value="INFO">INFO</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="DEBUG">DEBUG</option>
          </select>
        </div>

        <button
          onClick={handleResetFilters}
          style={buttons.reset}
        >
          重置
        </button>

        {/* 列显示控制 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>显示列：</label>
          <button
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: colors.light,
              border: `1px solid ${colors.border}`,
              borderRadius: borders.radius.sm,
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
            onClick={() => {
              const showColumns = document.getElementById('showColumns');
              if (showColumns) {
                showColumns.style.display = showColumns.style.display === 'block' ? 'none' : 'block';
              }
            }}
          >
            选择列
          </button>
          <div
            id="showColumns"
            style={{
              position: 'absolute' as const,
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
              borderRadius: borders.radius.sm,
              padding: spacing.md,
              display: 'none',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            {Object.entries(visibleColumns).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleColumnToggle(key as keyof typeof visibleColumns)}
                  disabled={['id', 'username', 'logLevel', 'logContent', 'time'].includes(key)}
                />
                <label style={{ 
                  fontSize: '0.9rem',
                  fontWeight: ['id', 'username', 'logLevel', 'logContent', 'time'].includes(key) ? '600' : '400'
                }}>
                  {{ 
                    id: 'ID',
                    username: '用户',
                    logLevel: '级别',
                    logContent: '内容',
                    requestUrl: 'URL',
                    method: '方法',
                    className: '类名',
                    ip: 'IP',
                    time: '时间'
                  }[key as keyof typeof visibleColumns]}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={layout.loading.container}>加载中...</div>
      ) : (
        <>
          <div style={layout.overflowX.auto}>
            <table style={{
              ...tables.default,
              ...logTables.container
            }}>
              <thead>
                <tr style={logTables.headerRow}>
                  {visibleColumns.id && (
                    <th style={{
                      ...logTables.headerCellCenter,
                      width: '50px'
                    }}>ID</th>
                  )}
                  {visibleColumns.username && (
                    <th style={{
                      ...logTables.headerCell,
                      width: '80px'
                    }}>用户</th>
                  )}
                  {visibleColumns.logLevel && (
                    <th style={{
                      ...logTables.headerCellCenter,
                      width: '80px'
                    }}>级别</th>
                  )}
                  {visibleColumns.logContent && (
                    <th style={{
                      ...logTables.headerCell,
                      minWidth: '180px'
                    }}>内容</th>
                  )}
                  {visibleColumns.requestUrl && (
                    <th style={{
                      ...logTables.headerCell,
                      width: '150px'
                    }}>URL</th>
                  )}
                  {visibleColumns.method && (
                    <th style={{
                      ...logTables.headerCell,
                      width: '120px'
                    }}>方法</th>
                  )}
                  {visibleColumns.className && (
                    <th style={{
                      ...logTables.headerCell,
                      width: '150px'
                    }}>类名</th>
                  )}
                  {visibleColumns.ip && (
                    <th style={{
                      ...logTables.headerCell,
                      width: '100px'
                    }}>IP</th>
                  )}
                  {visibleColumns.time && (
                    <th style={{
                      ...logTables.headerCellCenter,
                      width: '120px'
                    }}>时间</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={tables.row}>
                    {visibleColumns.id && (
                      <td style={logTables.cellCenter}>{log.id}</td>
                    )}
                    {visibleColumns.username && (
                      <td style={logTables.cell}>{log.username}</td>
                    )}
                    {visibleColumns.logLevel && (
                      <td style={logTables.cellCenter}>
                        <span style={{
                          ...logTables.levelTag,
                          ...(log.logLevel === 'ERROR' ? logTables.levelError : logTables.levelInfo)
                        }}>
                          {log.logLevel}
                        </span>
                      </td>
                    )}
                    {visibleColumns.logContent && (
                      <td style={logTables.cellWrap}>{log.logContent}</td>
                    )}
                    {visibleColumns.requestUrl && (
                      <td style={logTables.cellEllipsis}>
                        <span title={log.requestUrl}>{log.requestUrl}</span>
                      </td>
                    )}
                    {visibleColumns.method && (
                      <td style={logTables.cellEllipsis}>
                        <span title={`${log.className}.${log.methodName}`}>{log.methodName}</span>
                      </td>
                    )}
                    {visibleColumns.className && (
                      <td style={logTables.cellEllipsis}>
                        <span title={log.className}>{log.className}</span>
                      </td>
                    )}
                    {visibleColumns.ip && (
                      <td style={logTables.cell}>{log.ip}</td>
                    )}
                    {visibleColumns.time && (
                      <td style={logTables.cellSmall}>
                        {new Date(log.createTime).toLocaleString()}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={(page) => {
                setCurrentPage(page);
                presenter.onPageChange(page);
              }}
              onPageSizeChange={(size) => {
                setPageSize(size);
                presenter.onPageSizeChange(size);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LogsPage;