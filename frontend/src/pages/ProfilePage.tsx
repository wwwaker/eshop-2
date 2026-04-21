import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ProfileView } from '../contracts';
import { profilePresenter } from '../presenters';
import { useUser } from '../context/UserContext';
import { containers, typography, inputs, buttons, alerts, spacing } from '../styles';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const view: ProfileView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (msg: string) => setError(msg),
    showSuccess: (msg: string) => setMessage(msg),
    showUser: (user: User) => {
      setFormData({
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    },
    updateFormData: (data: { email: string; phone: string; address: string }) => {
      setFormData(data);
    }
  }), []);

  useEffect(() => {
    profilePresenter.attachView(view);

    return () => {
      profilePresenter.detachView();
    };
  }, [view, profilePresenter]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setFormData({
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!user) return;

    profilePresenter.updateProfile(user.id, formData);
  };

  if (!isAuthenticated || !user) {
    return <div style={containers.errorContainer}>请先登录</div>;
  }

  return (
    <div style={containers.pageContainer}>
      <h1 style={typography.h1}>个人中心</h1>
      {message && <div style={alerts.success}>{message}</div>}
      {error && <div style={alerts.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={containers.form}>
        <div style={containers.formGroup}>
          <label htmlFor="username" style={typography.label}>用户名</label>
          <input
            type="text"
            id="username"
            value={user.username}
            disabled
            style={inputs.disabled}
          />
        </div>

        <div style={containers.formGroup}>
          <label htmlFor="role" style={typography.label}>角色</label>
          <input
            type="text"
            id="role"
            value={user.role === 'ADMIN' ? '管理员' : '普通用户'}
            disabled
            style={inputs.disabled}
          />
        </div>

        <div style={containers.formGroup}>
          <label htmlFor="email" style={typography.label}>邮箱</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputs.default}
          />
        </div>

        <div style={containers.formGroup}>
          <label htmlFor="phone" style={typography.label}>手机号</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={inputs.default}
          />
        </div>

        <div style={containers.formGroup}>
          <label htmlFor="address" style={typography.label}>收货地址</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
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
          {loading ? '保存中...' : '保存修改'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;