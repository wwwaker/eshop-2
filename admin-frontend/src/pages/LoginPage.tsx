import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User } from '../types';
import { LoginView, LoginPresenter } from '../contracts';
import { loginPresenter } from '../presenters';

/**
 * 管理员登录页面
 * 提供管理员登录功能，验证用户凭证并跳转到后台管理系统
 */
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: contextLogin, user } = useUser();
  const navigate = useNavigate();

  const view: LoginView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showSuccess: (message: string) => console.log(message),
    navigateToDashboard: () => navigate('/dashboard'),
    navigateToLogin: () => navigate('/login'),
    updateFormData: (data: { username: string; password: string }) => {
      setUsername(data.username);
      setPassword(data.password);
    },
    setLoggedInUser: (user: User | null) => {
      // 这里可以调用 contextLogin 来更新全局状态
      if (user && user.username && user.password) {
        contextLogin(user.username, user.password).catch(() => {
          // 忽略错误，因为 Presenter 已经处理了错误
        });
      }
    }
  }), [navigate, contextLogin]);

  const presenter: LoginPresenter = loginPresenter;

  useEffect(() => {
    presenter.attachView(view);

    return () => {
      presenter.detachView();
    };
  }, [presenter, view]);

  /**
   * 处理登录表单提交
   * 验证用户名和密码，登录成功后跳转到仪表盘页面
   * @param e 表单提交事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    presenter.login(username, password);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>管理员登录</h2>
      {error && (
        <div style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #f5c6cb' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="username" style={{ fontWeight: '500' }}>用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="请输入管理员用户名"
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password" style={{ fontWeight: '500' }}>密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="请输入密码"
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            marginTop: '0.5rem'
          }}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
        默认账号：admin / admin123
      </div>
    </div>
  );
};

export default LoginPage;