import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { UsersView, UsersPresenter } from '../contracts';
import { usersPresenter } from '../presenters';
import Pagination from '../components/Pagination';
import { typography, tables, layout, colors, alerts, status, loading as loadingStyles, buttons, inputs } from '../styles';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const totalPages = Math.ceil(totalElements / pageSize);

  const view: UsersView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showUsers: (users: User[]) => setUsers(users),
    showDeleteSuccess: () => alert('删除成功'),
    showDeleteError: (message: string) => setError(message),
    refreshUsers: () => usersPresenter.loadUsers(),
    showTotalElements: (total: number) => setTotalElements(total)
  }), []);

  const presenter: UsersPresenter = usersPresenter;

  useEffect(() => {
    presenter.attachView(view);
    presenter.loadUsers();

    return () => {
      presenter.detachView();
    };
  }, [presenter, view]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    presenter.searchUsers(searchTerm);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
    presenter.sortUsers(field, field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setRoleFilter(role);
    presenter.onRoleFilterChange(role);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('确定删除吗？')) {
      presenter.deleteUser(id);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSortField('id');
    setSortOrder('desc');
    setRoleFilter('all');
    setCurrentPage(1);
    presenter.resetFilters();
  };



  return (
    <div>
      <h1 style={typography.h1}>用户管理</h1>

      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}

      <div style={layout.filterContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex' as const, flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="搜索用户名或邮箱..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              presenter.onSearchTermChange(e.target.value);
            }}
            style={inputs.search}
          />
          <button
            type="submit"
            style={buttons.search}
          >
            搜索
          </button>
        </form>

        <div style={{ display: 'flex' as const, alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>角色：</label>
          <select
            value={roleFilter}
            onChange={handleRoleFilter}
            style={inputs.select}
          >
            <option value="all">全部</option>
            <option value="ADMIN">管理员</option>
            <option value="USER">普通用户</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          style={buttons.reset}
        >
          重置
        </button>
      </div>

      {loading ? (
        <div style={loadingStyles.container}>加载中...</div>
      ) : (
        <div>
          <div style={layout.overflowX.auto}>
            <table style={tables.default}>
              <thead>
                <tr style={tables.header}>
                  <th 
                    style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                    onClick={() => handleSort('id')}
                  >
                    ID <span style={{ color: sortField === 'id' ? colors.primary : '#ccc', fontWeight: sortField === 'id' ? 'bold' : 'normal' }}>{sortField === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                  </th>
                  <th 
                    style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                    onClick={() => handleSort('username')}
                  >
                    用户名 <span style={{ color: sortField === 'username' ? colors.primary : '#ccc', fontWeight: sortField === 'username' ? 'bold' : 'normal' }}>{sortField === 'username' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                  </th>
                  <th style={tables.headerCell}>邮箱</th>
                  <th style={tables.headerCell}>手机号</th>
                  <th style={tables.headerCell}>地址</th>
                  <th 
                    style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                    onClick={() => handleSort('role')}
                  >
                    角色 <span style={{ color: sortField === 'role' ? colors.primary : '#ccc', fontWeight: sortField === 'role' ? 'bold' : 'normal' }}>{sortField === 'role' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                  </th>
                  <th style={tables.headerCell}>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={tables.row}>
                    <td style={tables.cell}>{user.id}</td>
                    <td style={tables.cell}>{user.username}</td>
                    <td style={tables.cell}>{user.email || '-'}</td>
                    <td style={tables.cell}>{user.phone || '-'}</td>
                    <td style={tables.cell}>{user.address || '-'}</td>
                    <td style={tables.cell}>
                      <span style={user.role === 'ADMIN' ? status.admin : status.user}>
                        {user.role === 'ADMIN' ? '管理员' : '普通用户'}
                      </span>
                    </td>
                    <td style={tables.cell}>
                      <div style={{ display: 'flex' as const, gap: '0.5rem' }}>
                        <Link 
                          to={`/users/edit/${user.id}`} 
                          style={buttons.smallSecondary}
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          style={buttons.smallDanger}
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
              setCurrentPage(1);
              presenter.onPageSizeChange(size);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UsersPage;