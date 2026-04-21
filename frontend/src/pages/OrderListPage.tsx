import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { OrderListView } from '../contracts';
import { orderListPresenter } from '../presenters';
import { useUser } from '../context/UserContext';
import { orderApi } from '../services/api';
import { containers, typography, buttons, tables, spacing, layout, colors, status as statusStyles } from '../styles';

const OrderListPage: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const view: OrderListView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showOrders: (orders: Order[]) => setOrders(orders),
    showEmptyState: () => setOrders([])
  }), []);

  useEffect(() => {
    orderListPresenter.attachView(view);

    return () => {
      orderListPresenter.detachView();
    };
  }, [view, orderListPresenter]);

  useEffect(() => {
    if (isAuthenticated && user) {
      orderListPresenter.loadOrders(user.id);
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user]);

  const handlePay = async (orderId: number) => {
    try {
      await orderApi.updateStatus(orderId, 'PAID');
      if (user) {
        orderListPresenter.loadOrders(user.id);
      }
    } catch (err) {
      setError('付款失败');
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await orderApi.updateStatus(orderId, 'CANCELLED');
      if (user) {
        orderListPresenter.loadOrders(user.id);
      }
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

  if (!isAuthenticated) {
    return <div style={containers.errorContainer}>请先登录</div>;
  }

  if (loading) {
    return <div style={containers.loadingContainer}>加载中...</div>;
  }

  return (
    <div style={containers.pageContainer}>
      <h1 style={typography.h1}>我的订单</h1>
      {error && <div style={{ color: colors.danger, marginBottom: spacing.md }}>{error}</div>}

      {orders.length === 0 ? (
        <div style={containers.emptyContainer}>
          <p>暂无订单</p>
          <button
            onClick={() => navigate('/')}
            style={buttons.primary}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttons.primaryHover)}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
          >
            去购物
          </button>
        </div>
      ) : (
        <table style={tables.default}>
          <thead style={tables.header}>
            <tr>
              <th style={tables.headerCell}>订单号</th>
              <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>总金额</th>
              <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>状态</th>
              <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>创建时间</th>
              <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={tables.row}>
                <td style={tables.cell}>{order.orderNo}</td>
                <td style={{ ...tables.cell, textAlign: 'center' as const }}>¥{order.totalAmount.toFixed(2)}</td>
                <td style={{ ...tables.cell, textAlign: 'center' as const }}>
                  <span style={getStatusStyle(order.status)}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td style={{ ...tables.cell, textAlign: 'center' as const }}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td style={{ ...tables.cell, textAlign: 'center' as const, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <Link
                    to={`/order/${order.id}`}
                    style={buttons.smallPrimary}
                  >
                    查看详情
                  </Link>
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handlePay(order.id)}
                        style={buttons.smallPrimary}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.success}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                      >
                        付款
                      </button>
                      <button
                        onClick={() => handleCancel(order.id)}
                        style={buttons.smallDanger}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.dangerHover || colors.danger}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.danger}
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