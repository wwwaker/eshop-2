import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { OrdersView, OrdersPresenter } from '../contracts';
import { ordersPresenter } from '../presenters';
import { typography, tables, layout, colors, alerts, status, loading as loadingStyles, buttons, inputs } from '../styles';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const view: OrdersView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showOrders: (orders: Order[]) => setOrders(orders),
    refreshOrders: () => ordersPresenter.loadOrders()
  }), []);

  const presenter: OrdersPresenter = ordersPresenter;

  useEffect(() => {
    presenter.attachView(view);
    presenter.loadOrders();

    return () => {
      presenter.detachView();
    };
  }, [presenter, view]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    presenter.searchOrders(searchTerm);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
    presenter.sortOrders(field, field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    presenter.onStatusFilterChange(status);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSortField('createdAt');
    setSortOrder('desc');
    setStatusFilter('all');
    presenter.resetFilters();
  };

  return (
    <div>
      <h1 style={typography.h1}>订单管理</h1>

      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}

      <div style={layout.filterContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex' as const, flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="搜索订单号或用户名..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              presenter.onSearchTermChange(e.target.value);
            }}
            style={inputs.search}
          />
          <button
            type="submit"
            style={buttons.search}
          >
            搜索
          </button>
        </form>

        <div style={{ display: 'flex' as const, alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>状态：</label>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            style={inputs.select}
          >
            <option value="all">全部</option>
            <option value="PENDING">待处理</option>
            <option value="PAID">已支付</option>
            <option value="SHIPPED">已发货</option>
            <option value="DELIVERED">已送达</option>
            <option value="CANCELLED">已取消</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          style={buttons.reset}
        >
          重置
        </button>
      </div>

      {loading ? (
        <div style={loadingStyles.container}>加载中...</div>
      ) : (
        <div style={layout.overflowX.auto}>
          <table style={tables.default}>
            <thead>
              <tr style={tables.header}>
                <th style={tables.headerCell}>订单号</th>
                <th style={tables.headerCell}>用户</th>
                <th 
                  style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('totalAmount')}
                >
                  金额 <span style={{ color: sortField === 'totalAmount' ? colors.primary : '#ccc', fontWeight: sortField === 'totalAmount' ? 'bold' : 'normal' }}>{sortField === 'totalAmount' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={tables.headerCell}>状态</th>
                <th style={tables.headerCell}>收货人</th>
                <th style={tables.headerCell}>联系电话</th>
                <th style={tables.headerCell}>收货地址</th>
                <th 
                  style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('createdAt')}
                >
                  创建时间 <span style={{ color: sortField === 'createdAt' ? colors.primary : '#ccc', fontWeight: sortField === 'createdAt' ? 'bold' : 'normal' }}>{sortField === 'createdAt' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={tables.headerCell}>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={tables.row}>
                  <td style={tables.cell}>{order.orderNo}</td>
                  <td style={tables.cell}>{order.user?.username || ''}</td>
                  <td style={tables.cell}>¥{order.totalAmount.toFixed(2)}</td>
                  <td style={tables.cell}>
                    <span style={{ ...status.order, backgroundColor: presenter.getStatusColor(order.status) }}>
                      {presenter.getStatusText(order.status)}
                    </span>
                  </td>
                  <td style={tables.cell}>{order.receiverName}</td>
                  <td style={tables.cell}>{order.receiverPhone}</td>
                  <td style={tables.cell}>{order.receiverAddress}</td>
                  <td style={tables.cell}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td style={tables.cell}>
                    <Link 
                      to={`/orders/detail/${order.id}`} 
                      style={buttons.smallPrimary}
                    >
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;