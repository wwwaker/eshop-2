import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterView } from '../contracts';
import { registerPresenter } from '../presenters';
import { containers, typography, inputs, buttons, alerts, spacing } from '../styles';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const view: RegisterView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showSuccess: (message: string) => setSuccess(message),
    navigateToLogin: () => navigate('/login'),
    updateFormData: () => {}
  }), [navigate]);

  useEffect(() => {
    registerPresenter.attachView(view);

    return () => {
      registerPresenter.detachView();
    };
  }, [view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    registerPresenter.register({ username, password, email, phone, address });
  };

  return (
    <div style={containers.registerContainer}>
      <h2 style={{ ...typography.h2, ...typography.textCenter }}>用户注册</h2>
      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}
      {success && (
        <div style={alerts.success}>
          {success}
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
            minLength={3}
            maxLength={20}
            placeholder="请输入用户名"
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
            minLength={6}
            placeholder="请输入密码（至少6位）"
            style={inputs.default}
          />
        </div>

        <div style={containers.formGroup}>
          <label htmlFor="confirmPassword" style={typography.label}>确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="请再次输入密码"
            style={inputs.default}
          />
        </div>

        <div style={containers.formGroup}>
          <label htmlFor="email" style={typography.label}>邮箱</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="请输入邮箱"
            style={inputs.default}
          />
        </div>

        <div style={containers.formGroup}>
          <label htmlFor="phone" style={typography.label}>手机号</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="请输入手机号"
            style={inputs.default}
          />
        </div>

        <div style={containers.formGroup}>
          <label htmlFor="address" style={typography.label}>收货地址</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="请输入收货地址"
            style={inputs.textarea}
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
          {loading ? '注册中...' : '注册'}
        </button>
      </form>
      <div style={{ marginTop: spacing.lg, ...typography.textCenter }}>
        <span style={{ color: '#666' }}>已有账号？</span>
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>立即登录</Link>
      </div>
    </div>
  );
};

export default RegisterPage;