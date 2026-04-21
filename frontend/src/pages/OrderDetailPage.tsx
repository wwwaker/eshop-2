import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { OrderDetailView } from '../contracts';
import { orderDetailPresenter } from '../presenters';
import { useUser } from '../context/UserContext';
import { orderApi } from '../services/api';
import { containers, typography, buttons, tables, images, spacing, layout, colors, status as statusStyles } from '../styles';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const view: OrderDetailView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showOrder: (order: Order) => setOrder(order)
  }), []);

  useEffect(() => {
    orderDetailPresenter.attachView(view);

    return () => {
      orderDetailPresenter.detachView();
    };
  }, [view, orderDetailPresenter]);

  useEffect(() => {
    if (isAuthenticated && id) {
      orderDetailPresenter.loadOrder(parseInt(id));
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, id]);

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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return { ...statusStyles.order, ...statusStyles.orderPending };
      case 'PAID': return { ...statusStyles.order, ...statusStyles.orderPaid };
      case 'SHIPPED': return { ...statusStyles.order, ...statusStyles.orderShipped };
      case 'COMPLETED': return { ...statusStyles.order, ...statusStyles.orderCompleted };
      case 'CANCELLED': return { ...statusStyles.order, ...statusStyles.orderCancelled };
      default: return statusStyles.order;
    }
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handlePay = async () => {
    if (!order) return;
    try {
      await orderApi.updateStatus(order.id, 'PAID');
      orderDetailPresenter.loadOrder(order.id);
    } catch (err) {
      setError('付款失败');
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    try {
      await orderApi.updateStatus(order.id, 'CANCELLED');
      orderDetailPresenter.loadOrder(order.id);
    } catch (err) {
      setError('取消订单失败');
    }
  };

  if (!isAuthenticated) {
    return <div style={containers.errorContainer}>请先登录</div>;
  }

  if (loading) {
    return <div style={containers.loadingContainer}>加载中...</div>;
  }

  if (error || !order) {
    return <div style={containers.errorContainer}>{error || '订单不存在'}</div>;
  }

  return (
    <div style={containers.pageContainer}>
      <h1 style={typography.h1}>订单详情</h1>

      <div style={{ ...containers.card, marginBottom: spacing.xl }}>
        <h2 style={typography.h2}>订单信息</h2>
        <div style={layout.gridTwoColumn}>
          <div>
            <p><strong>订单号：</strong>{order.orderNo}</p>
            <p><strong>总金额：</strong>¥{order.totalAmount.toFixed(2)}</p>
            <p><strong>订单状态：</strong>
              <span style={getStatusStyle(order.status)}>
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
          <div style={{ ...layout.flex.row, ...layout.gap.md, marginTop: spacing.md }}>
            <button
              onClick={handlePay}
              style={buttons.success}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttons.successHover)}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
            >
              立即付款
            </button>
            <button
              onClick={handleCancel}
              style={buttons.danger}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttons.dangerHover)}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
            >
              取消订单
            </button>
          </div>
        )}
      </div>

      <h2 style={typography.h2}>商品列表</h2>
      <table style={tables.default}>
        <thead style={tables.header}>
          <tr>
            <th style={tables.headerCell}>商品</th>
            <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>单价</th>
            <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>数量</th>
            <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>小计</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} style={tables.row}>
              <td style={tables.cell}>
                <div style={layout.flex.row}>
                  {item.product?.imageUrl && !imageErrors[item.product.id] ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.productName}
                      onError={() => handleImageError(item.product.id)}
                      style={images.thumbnail}
                    />
                  ) : (
                    <div style={{ ...images.placeholder, width: '80px', height: '80px' }}>
                      无图片
                    </div>
                  )}
                  <div style={{ marginLeft: spacing.md }}>
                    <h3 style={typography.h3}>{item.productName}</h3>
                  </div>
                </div>
              </td>
              <td style={{ ...tables.cell, textAlign: 'center' as const }}>¥{item.productPrice.toFixed(2)}</td>
              <td style={{ ...tables.cell, textAlign: 'center' as const }}>{item.quantity}</td>
              <td style={{ ...tables.cell, textAlign: 'center' as const, fontWeight: 'bold' as const }}>¥{item.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot style={tables.footer}>
          <tr>
            <td colSpan={3} style={{
              ...tables.footerCell,
              ...typography.textRight
            }}>总计：</td>
            <td style={{
              ...tables.footerCell,
              textAlign: 'center' as const,
              color: colors.danger
            }}>¥{order.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderDetailPage;