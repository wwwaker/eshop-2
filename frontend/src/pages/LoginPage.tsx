import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LoginView } from '../contracts';
import { loginPresenter } from '../presenters';
import { useUser } from '../context/UserContext';
import { containers, typography, inputs, buttons, alerts, spacing } from '../styles';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const view: LoginView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    navigateToHome: () => navigate('/'),
    navigateToRegister: () => navigate('/register'),
    setLoggedInUser: (user: User | null) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    }
  }), [navigate, setUser]);

  useEffect(() => {
    loginPresenter.attachView(view);

    return () => {
      loginPresenter.detachView();
    };
  }, [view, loginPresenter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginPresenter.login(username, password);
  };

  return (
    <div style={containers.loginContainer}>
      <h2 style={{ ...typography.h2, ...typography.textCenter }}>登录</h2>
      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={containers.form}>
        <div style={containers.formGroup}>
          <label htmlFor="username" style={typography.label}>用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputs.default}
          />
        </div>
        <div style={containers.formGroup}>
          <label htmlFor="password" style={typography.label}>密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputs.default}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={loading ? buttons.disabled : buttons.primary}
          onMouseEnter={(e) => {
            if (!loading) {
              Object.assign(e.currentTarget.style, buttons.primaryHover);
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '';
            }
          }}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
      <div style={{ marginTop: spacing.md, ...typography.textCenter }}>
        <span style={{ color: '#666' }}>没有账号？</span>
        <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>立即注册</Link>
      </div>
    </div>
  );
};

export default LoginPage;