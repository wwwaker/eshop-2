import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { OrderDetailView, OrderDetailPresenter } from '../contracts';
import { orderDetailPresenter } from '../presenters';

/**
 * 订单详情页面
 * 展示单个订单的详细信息，包括订单信息和商品列表
 */
const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const view: OrderDetailView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showOrder: (order: Order) => setOrder(order),
    navigateToOrders: () => navigate('/orders'),
    updateImageErrors: (errors: Record<string, boolean>) => setImageErrors(errors)
  }), [navigate]);

  const presenter: OrderDetailPresenter = orderDetailPresenter;

  useEffect(() => {
    presenter.attachView(view);
    if (id) {
      presenter.loadOrder(Number(id));
    }

    return () => {
      presenter.detachView();
    };
  }, [id, presenter, view]);

  /**
   * 处理图片加载错误
   * @param productId 商品ID
   */
  const handleImageError = (productId: number) => {
    presenter.handleImageError(productId);
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error || !order) {
    return <div style={{ color: 'red' }}>{error || '订单不存在'}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>订单详情</h1>
        <button
          onClick={() => navigate('/orders')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          返回订单列表
        </button>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #dee2e6', borderRadius: '4px' }}>
        <h2>订单信息</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div>
            <p><strong>订单号：</strong>{order.orderNo}</p>
            <p><strong>总金额：</strong>¥{order.totalAmount.toFixed(2)}</p>
            <p><strong>订单状态：</strong>
              <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                backgroundColor: presenter.getStatusColor(order.status),
                color: 'white'
              }}>
                {presenter.getStatusText(order.status)}
              </span>
            </p>
            <p><strong>用户：</strong>{order.user?.username || ''}</p>
          </div>
          <div>
            <p><strong>收货人：</strong>{order.receiverName}</p>
            <p><strong>联系电话：</strong>{order.receiverPhone}</p>
            <p><strong>收货地址：</strong>{order.receiverAddress}</p>
            <p><strong>创建时间：</strong>{new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>更新时间：</strong>{new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <h2>商品列表</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>商品</th>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>单价</th>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>数量</th>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>小计</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {item.product?.imageUrl && !imageErrors[item.product.id] ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.productName}
                        onError={() => handleImageError(item.product!.id)}
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
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>¥{item.productPrice.toFixed(2)}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.quantity}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>¥{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid #dee2e6' }}>
              <td colSpan={3} style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>总计：</td>
              <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#dc3545' }}>¥{order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailPage;