import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { User } from '../types';
import { useUser } from '../context/UserContext';

/**
 * 个人中心页面组件
 * 展示和修改用户的个人信息，包括邮箱、手机号和收货地址
 */
const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    try {
      const response = await userApi.updateProfile({
        id: user!.id,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
      if (response.success) {
        setMessage('保存成功');
        if (updateUser) {
          updateUser({
            ...user!,
            email: formData.email,
            phone: formData.phone,
            address: formData.address
          });
        }
      } else {
        setError(response.message || '保存失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '保存失败');
    }
  };

  if (!isAuthenticated || !user) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>请先登录</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>个人中心</h1>
      {message && <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            value={user.username}
            disabled
            style={{ padding: '0.5rem', backgroundColor: '#e9ecef' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="role">角色</label>
          <input
            type="text"
            id="role"
            value={user.role === 'ADMIN' ? '管理员' : '普通用户'}
            disabled
            style={{ padding: '0.5rem', backgroundColor: '#e9ecef' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="email">邮箱</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="phone">手机号</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="address">收货地址</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            style={{ padding: '0.5rem' }}
          />
        </div>
        
        <button
          type="submit"
          style={{
            padding: '0.8rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          保存修改
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
