import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User } from '../types';
import { LoginView, LoginPresenter } from '../contracts';
import { loginPresenter } from '../presenters';
import { containers, typography, inputs, buttons, alerts, layout } from '../styles';

/**
 * 管理员登录页面
 * 提供管理员登录功能，验证用户凭证并跳转到后台管理系统
 */
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: contextLogin, refreshUser } = useUser();
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
      if (user) {
        refreshUser(user);
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
    <div style={containers.loginContainer}>
      <h2 style={{ ...typography.textCenter, marginBottom: '2rem' }}>管理员登录</h2>
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
            placeholder="请输入管理员用户名"
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
            placeholder="请输入密码"
            style={inputs.default}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={loading ? buttons.disabled : buttons.primary}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
      <div style={{ ...layout.marginTop.sm, ...typography.textCenter, ...typography.textSmall }}>
        默认账号：admin / admin123
      </div>
    </div>
  );
};

export default LoginPage;