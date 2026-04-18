import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * 订单类型定义
 * 包含订单的详细信息，如订单号、用户信息、金额、状态、收货信息等
 */
interface Order {
  id: number;
  orderNo: string;
  userId: number;
  totalAmount: number;
  status: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
  };
}

/**
 * 订单管理页面
 * 展示所有订单列表，提供查看订单详情的功能
 */
const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * 获取订单列表
   * 从后端API获取所有订单数据
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/orders');
      setOrders(response.data);
      setError('');
    } catch (err: any) {
      setError('获取订单列表失败');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取订单状态的中文文本
   * @param status 订单状态（英文）
   * @returns 订单状态的中文文本
   */
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待处理',
      'PAID': '已支付',
      'SHIPPED': '已发货',
      'DELIVERED': '已送达',
      'CANCELLED': '已取消'
    };
    return statusMap[status] || status;
  };

  /**
   * 获取订单状态对应的颜色
   * @param status 订单状态
   * @returns 对应的颜色值
   */
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'PENDING': '#ffc107',
      'PAID': '#28a745',
      'SHIPPED': '#17a2b8',
      'DELIVERED': '#6c757d',
      'CANCELLED': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  };

  return (
    <div>
      <h1>订单管理</h1>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>订单号</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>用户</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>金额</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>状态</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>收货人</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>联系电话</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>收货地址</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>创建时间</th>
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
                      backgroundColor: getStatusColor(order.status),
                      color: 'white'
                    }}>
                      {getStatusText(order.status)}
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