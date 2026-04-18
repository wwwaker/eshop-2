import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';
import { Order } from '../types';
import { useUser } from '../context/UserContext';

/**
 * 订单详情页面组件
 * 展示单个订单的详细信息，包括订单信息、商品列表，提供付款和取消订单功能
 */
const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && id) {
      loadOrder();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getById(parseInt(id!));
      setOrder(data);
    } catch (err) {
      setError('加载订单失败');
    } finally {
      setLoading(false);
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

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handlePay = async () => {
    try {
      await orderApi.updateStatus(order!.id, 'PAID');
      loadOrder();
    } catch (err) {
      setError('付款失败');
    }
  };

  const handleCancel = async () => {
    try {
      await orderApi.updateStatus(order!.id, 'CANCELLED');
      loadOrder();
    } catch (err) {
      setError('取消订单失败');
    }
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>请先登录</div>;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>;
  }

  if (error || !order) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error || '订单不存在'}</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>订单详情</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h2>订单信息</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div>
            <p><strong>订单号：</strong>{order.orderNo}</p>
            <p><strong>总金额：</strong>¥{order.totalAmount.toFixed(2)}</p>
            <p><strong>订单状态：</strong>
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
            </p>
          </div>
          <div>
            <p><strong>收货人：</strong>{order.receiverName}</p>
            <p><strong>联系电话：</strong>{order.receiverPhone}</p>
            <p><strong>收货地址：</strong>{order.receiverAddress}</p>
            <p><strong>创建时间：</strong>{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        {order.status === 'PENDING' && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={handlePay}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
            >
              立即付款
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            >
              取消订单
            </button>
          </div>
        )}
      </div>

      <h2>商品列表</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '1rem', textAlign: 'left' }}>商品</th>
            <th style={{ padding: '1rem', textAlign: 'center' }}>单价</th>
            <th style={{ padding: '1rem', textAlign: 'center' }}>数量</th>
            <th style={{ padding: '1rem', textAlign: 'center' }}>小计</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.product?.imageUrl && !imageErrors[item.product.id] ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.productName}
                      onError={() => handleImageError(item.product.id)}
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      无图片
                    </div>
                  )}
                  <div>
                    <h3 style={{ margin: '0' }}>{item.productName}</h3>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>¥{item.productPrice.toFixed(2)}</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>¥{item.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '2px solid #ddd' }}>
            <td colSpan={3} style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>总计：</td>
            <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#dc3545' }}>¥{order.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderDetailPage;
