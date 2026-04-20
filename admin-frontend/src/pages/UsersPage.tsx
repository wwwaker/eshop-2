import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { UsersView, UsersPresenter } from '../contracts';
import { usersPresenter } from '../presenters';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const view: UsersView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showUsers: (users: User[]) => setUsers(users),
    showDeleteSuccess: () => alert('删除成功'),
    showDeleteError: (message: string) => setError(message),
    refreshUsers: () => usersPresenter.loadUsers()
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
    presenter.resetFilters();
  };

  return (
    <div>
      <h1>用户管理</h1>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="搜索用户名、邮箱或手机号..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              presenter.onSearchTermChange(e.target.value);
            }}
            style={{
              flex: '1',
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px 0 0 4px',
              fontSize: '0.9rem'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: '1px solid #007bff',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer'
            }}
          >
            搜索
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>角色：</label>
          <select
            value={roleFilter}
            onChange={handleRoleFilter}
            style={{
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">全部</option>
            <option value="ADMIN">管理员</option>
            <option value="USER">普通用户</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: '1px solid #6c757d',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          重置
        </button>
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('id')}
                >
                  ID <span style={{ color: sortField === 'id' ? '#007bff' : '#ccc', fontWeight: sortField === 'id' ? 'bold' : 'normal' }}>{sortField === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('username')}
                >
                  用户名 <span style={{ color: sortField === 'username' ? '#007bff' : '#ccc', fontWeight: sortField === 'username' ? 'bold' : 'normal' }}>{sortField === 'username' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>邮箱</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>手机号</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>地址</th>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('role')}
                >
                  角色 <span style={{ color: sortField === 'role' ? '#007bff' : '#ccc', fontWeight: sortField === 'role' ? 'bold' : 'normal' }}>{sortField === 'role' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.id}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.username}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.email || '-'}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.phone || '-'}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.address || '-'}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: user.role === 'ADMIN' ? '#17a2b8' : '#28a745',
                      color: 'white'
                    }}>
                      {user.role === 'ADMIN' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/users/edit/${user.id}`} 
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
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
      )}
    </div>
  );
};

export default UsersPage;