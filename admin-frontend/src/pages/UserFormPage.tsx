import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../types';
import { UserFormView, UserFormPresenter } from '../contracts';
import { userFormPresenter } from '../presenters';
import { typography, layout, alerts, inputs, buttons, loading as loadingStyles } from '../styles';

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    email: '',
    phone: '',
    address: '',
    role: 'USER',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const view: UserFormView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showSuccess: (message: string) => setSuccess(message),
    showUser: (user: User) => setFormData(user),
    navigateToUsers: () => navigate('/users'),
    updateFormData: (data: User) => setFormData(data)
  }), [navigate]);

  const presenter: UserFormPresenter = userFormPresenter;

  useEffect(() => {
    presenter.attachView(view);
    if (isEdit && id) {
      presenter.loadUser(Number(id));
    } else {
      setLoading(false);
    }

    return () => {
      presenter.detachView();
    };
  }, [id, isEdit, presenter, view]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEdit && id) {
        presenter.updateUser(Number(id), formData as User);
      } else {
        presenter.saveUser(formData as User);
      }
    } catch (err) {
      setError(isEdit ? '用户更新失败' : '用户添加失败');
    }
  };

  return (
    <div>
      <h1 style={typography.h1}>{isEdit ? '编辑用户' : '添加用户'}</h1>

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

      {loading ? (
        <div style={loadingStyles.container}>加载中...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={layout.marginBottom.sm}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>用户名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ ...inputs.default, width: '100%' }}
            />
          </div>

          <div style={layout.marginBottom.sm}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>邮箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ ...inputs.default, width: '100%' }}
            />
          </div>

          <div style={layout.marginBottom.sm}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>电话</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ ...inputs.default, width: '100%' }}
            />
          </div>

          <div style={layout.marginBottom.sm}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>地址</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={4}
              style={{ ...inputs.default, width: '100%' }}
            />
          </div>

          <div style={layout.marginBottom.sm}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ ...inputs.default, width: '100%' }}
            />
          </div>

          <div style={layout.marginBottom.sm}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>角色</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{ ...inputs.default, width: '100%' }}
            >
              <option value="USER">用户</option>
              <option value="ADMIN">管理员</option>
            </select>
          </div>

          <div style={{ display: 'flex' as const, gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              style={buttons.primary}
            >
              {isEdit ? '更新用户' : '添加用户'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/users')}
              style={buttons.secondary}
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserFormPage;