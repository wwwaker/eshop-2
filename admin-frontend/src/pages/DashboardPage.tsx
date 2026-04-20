import React, { useState, useEffect, useMemo } from 'react';
import { DashboardData } from '../types';
import { DashboardView, DashboardPresenter } from '../contracts';
import { dashboardPresenter } from '../presenters';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const view: DashboardView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showDashboardData: (data: DashboardData) => setDashboardData(data)
  }), []);

  const presenter: DashboardPresenter = dashboardPresenter;

  useEffect(() => {
    presenter.attachView(view);
    presenter.loadDashboardData();

    return () => {
      presenter.detachView();
    };
  }, [presenter, view]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>加载中...</div>;
  }

  if (error || !dashboardData) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>{error || '数据加载失败'}</div>;
  }

  return (
    <div>
      <h1>后台管理仪表盘</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>今日数据</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>今日订单</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.todayOrders}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>今日新用户</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.todayNewUsers}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>今日销售额</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#28a745' }}>¥{dashboardData.todaySales.toFixed(2)}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>今日新增商品</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.newProducts}</p>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>总体统计</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>商品总数</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.totalProducts || 0}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>分类数量</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.totalCategories || 0}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>订单总数</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.totalOrders || 0}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>用户数量</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>销售趋势</h3>
          <div style={{ height: '300px', border: '1px solid #ddd', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dashboardData.salesTrend && dashboardData.salesTrend.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.date}</span>
                  <span>订单数: {item.orderCount}, 销售额: ¥{item.totalAmount.toFixed(2)}</span>
                </div>
              ))}
              {!dashboardData.salesTrend && (
                <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>暂无销售数据</div>
              )}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>用户活跃度</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dashboardData.activeUsers ? (
              <>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>总用户数</span>
                    <span>{dashboardData.activeUsers.total}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#007bff', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>今日活跃</span>
                    <span>{dashboardData.activeUsers.today}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                    <div 
                      style={{ 
                        width: `${(dashboardData.activeUsers.today / (dashboardData.activeUsers.total || 1)) * 100}%`, 
                        height: '100%', 
                        backgroundColor: '#28a745', 
                        borderRadius: '4px' 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>本周活跃</span>
                    <span>{dashboardData.activeUsers.week}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                    <div 
                      style={{ 
                        width: `${(dashboardData.activeUsers.week / (dashboardData.activeUsers.total || 1)) * 100}%`, 
                        height: '100%', 
                        backgroundColor: '#ffc107', 
                        borderRadius: '4px' 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>本月活跃</span>
                    <span>{dashboardData.activeUsers.month}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                    <div 
                      style={{ 
                        width: `${(dashboardData.activeUsers.month / (dashboardData.activeUsers.total || 1)) * 100}%`, 
                        height: '100%', 
                        backgroundColor: '#dc3545', 
                        borderRadius: '4px' 
                      }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>暂无用户数据</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>热门商品 TOP 10</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>排名</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>商品图片</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>商品名称</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>价格</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>销量</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.hotProducts && dashboardData.hotProducts.map((product, index) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}></div>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{product.name}</td>
                  <td style={{ padding: '0.75rem' }}>¥{product.price.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', color: '#dc3545', fontWeight: 'bold' }}>{product.totalSold}</td>
                </tr>
              ))}
              {(!dashboardData.hotProducts || dashboardData.hotProducts.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#999' }}>暂无销售数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;