import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * 用户类型定义
 * 包含用户的详细信息，如ID、用户名、邮箱、电话、地址、角色等
 */
interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
}

/**
 * 用户管理页面
 * 展示所有用户列表，提供编辑、删除用户的功能
 */
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * 获取用户列表
   * 从后端API获取所有用户数据
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/users');
      setUsers(response.data);
      setError('');
    } catch (err: any) {
      setError('获取用户列表失败');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除用户
   * 弹出确认对话框，确认后从后端删除用户
   * @param id 用户ID
   */
  const handleDelete = async (id: number) => {
    if (window.confirm('确定删除吗？')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/users/${id}`);
        fetchUsers();
      } catch (err: any) {
        setError('删除用户失败');
        console.error('Error deleting user:', err);
      }
    }
  };

  return (
    <div>
      <h1>用户管理</h1>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>用户名</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>邮箱</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>电话</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>地址</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>角色</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>创建时间</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.id}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.username}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.email}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.phone}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.address || '-'}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: user.role === 'ADMIN' ? '#007bff' : '#28a745',
                      color: 'white'
                    }}>
                      {user.role === 'ADMIN' ? '管理员' : '用户'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    {new Date(user.createdAt).toLocaleString()}
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