import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';
import { Order } from '../types';
import { useUser } from '../context/UserContext';

/**
 * 订单列表页面组件
 * 展示用户的所有订单列表，提供查看订单详情、付款和取消订单功能
 */
const OrderListPage: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await orderApi.getUserOrders(user.id);
      setOrders(data);
    } catch (err) {
      setError('加载订单失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (orderId: number) => {
    try {
      await orderApi.updateStatus(orderId, 'PAID');
      loadOrders();
    } catch (err) {
      setError('付款失败');
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await orderApi.updateStatus(orderId, 'CANCELLED');
      loadOrders();
    } catch (err) {
      setError('取消订单失败');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '待付款';
      case 'PAID': return '已付款';
      case 'SHIPPED': return '已发货';
      case 'COMPLETED': return '已完成';
      case 'CANCELLED': return '已取消';
      default: return status;
    }
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>请先登录</div>;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>我的订单</h1>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>暂无订单</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            去购物
          </button>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>订单号</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>总金额</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>状态</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>创建时间</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '1rem' }}>{order.orderNo}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>¥{order.totalAmount.toFixed(2)}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    backgroundColor: order.status === 'COMPLETED' ? '#d4edda' : 
                                   order.status === 'CANCELLED' ? '#f8d7da' : 
                                   order.status === 'PENDING' ? '#fff3cd' : '#d1ecf1',
                    color: order.status === 'COMPLETED' ? '#155724' : 
                           order.status === 'CANCELLED' ? '#721c24' : 
                           order.status === 'PENDING' ? '#856404' : '#0c5460'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <Link
                    to={`/order/${order.id}`}
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      marginRight: '0.5rem'
                    }}
                  >
                    查看详情
                  </Link>
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handlePay(order.id)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          marginRight: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        付款
                      </button>
                      <button
                        onClick={() => handleCancel(order.id)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        取消
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListPage;
