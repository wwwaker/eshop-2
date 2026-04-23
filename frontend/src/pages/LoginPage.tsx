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
  const [captcha, setCaptcha] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
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
    },
    showCaptcha: (image: string) => setCaptchaImage(image),
    updateCaptchaInput: (value: string) => setCaptcha(value)
  }), [navigate, setUser]);

  useEffect(() => {
    loginPresenter.attachView(view);
    // 加载验证码
    loginPresenter.loadCaptcha();

    return () => {
      loginPresenter.detachView();
    };
  }, [view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginPresenter.login(username, password, captcha);
  };

  const handleCaptchaRefresh = () => {
    loginPresenter.loadCaptcha();
    setCaptcha('');
  };

  return (
    <div style={containers.loginContainer}>
      <h2 style={{ ...typography.h2, ...typography.textCenter, marginBottom: spacing.xs }}>登录</h2>
      <p style={{ ...typography.textCenter, color: '#64748b', marginTop: 0, marginBottom: spacing.lg }}>
        欢迎回来，继续你的购物旅程
      </p>
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
        <div style={containers.formGroup}>
          <label htmlFor="captcha" style={typography.label}>验证码</label>
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <input
              type="text"
              id="captcha"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              required
              style={{ flex: 1, ...inputs.default }}
              placeholder="请输入验证码"
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={`data:image/png;base64,${captchaImage}`}
                alt="验证码"
                style={{ height: '40px', cursor: 'pointer' }}
                onClick={handleCaptchaRefresh}
              />
            </div>
          </div>
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
        <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>立即注册</Link>
      </div>
    </div>
  );
};

export default LoginPage;