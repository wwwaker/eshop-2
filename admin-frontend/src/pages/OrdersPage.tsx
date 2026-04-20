import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { OrdersView, OrdersPresenter } from '../contracts';
import { ordersPresenter } from '../presenters';

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
      <h1>订单管理</h1>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="搜索订单号或用户名..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              presenter.onSearchTermChange(e.target.value);
            }}
            style={{
              flex: '1',
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px 0 0 4px',
              fontSize: '0.9rem'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: '1px solid #007bff',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer'
            }}
          >
            搜索
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>状态：</label>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            style={{
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
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
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: '1px solid #6c757d',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          重置
        </button>
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>订单号</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>用户</th>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('totalAmount')}
                >
                  金额 <span style={{ color: sortField === 'totalAmount' ? '#007bff' : '#ccc', fontWeight: sortField === 'totalAmount' ? 'bold' : 'normal' }}>{sortField === 'totalAmount' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>状态</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>收货人</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>联系电话</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>收货地址</th>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('createdAt')}
                >
                  创建时间 <span style={{ color: sortField === 'createdAt' ? '#007bff' : '#ccc', fontWeight: sortField === 'createdAt' ? 'bold' : 'normal' }}>{sortField === 'createdAt' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{order.orderNo}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{order.user?.username || ''}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>¥{order.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: presenter.getStatusColor(order.status),
                      color: 'white'
                    }}>
                      {presenter.getStatusText(order.status)}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{order.receiverName}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{order.receiverPhone}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{order.receiverAddress}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    <Link 
                      to={`/orders/detail/${order.id}`} 
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.8rem'
                      }}
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