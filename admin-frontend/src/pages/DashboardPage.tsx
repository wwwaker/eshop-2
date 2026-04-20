import React, { useState, useEffect, useMemo } from 'react';
import { DashboardData } from '../types';
import { DashboardView, DashboardPresenter } from '../contracts';
import { dashboardPresenter } from '../presenters';
import { containers, typography, tables, images, loading as loadingStyles, layout, progressBar, colors, charts } from '../styles';

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
    return <div style={loadingStyles.container}>加载中...</div>;
  }

  if (error || !dashboardData) {
    return <div style={{ ...loadingStyles.container, color: colors.danger }}>{error || '数据加载失败'}</div>;
  }

  return (
    <div>
      <h1 style={typography.h1}>后台管理仪表盘</h1>
      
      <div style={layout.marginBottom.md}>
        <h2 style={typography.h2}>今日数据</h2>
        <div style={containers.grid}>
          <div style={containers.card}>
            <h3 style={typography.h3}>今日订单</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.todayOrders}</p>
          </div>
          <div style={containers.card}>
            <h3 style={typography.h3}>今日新用户</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.todayNewUsers}</p>
          </div>
          <div style={containers.card}>
            <h3 style={typography.h3}>今日销售额</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: colors.success }}>¥{dashboardData.todaySales.toFixed(2)}</p>
          </div>
          <div style={containers.card}>
            <h3 style={typography.h3}>今日新增商品</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.newProducts}</p>
          </div>
        </div>
      </div>
      
      <div style={layout.marginBottom.md}>
        <h2 style={typography.h2}>总体统计</h2>
        <div style={containers.grid}>
          <div style={containers.card}>
            <h3 style={typography.h3}>商品总数</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.totalProducts || 0}</p>
          </div>
          <div style={containers.card}>
            <h3 style={typography.h3}>分类数量</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.totalCategories || 0}</p>
          </div>
          <div style={containers.card}>
            <h3 style={typography.h3}>订单总数</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.totalOrders || 0}</p>
          </div>
          <div style={containers.card}>
            <h3 style={typography.h3}>用户数量</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardData.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ ...containers.gridTwoColumn, ...layout.marginBottom.md }}>
        <div style={containers.card}>
          <h3 style={typography.h3}>销售趋势</h3>
          <div style={charts.container}>
            <div style={{ ...layout.flexColumn, ...layout.gap.sm }}>
              {dashboardData.salesTrend && dashboardData.salesTrend.map((item, index) => (
                <div key={index} style={layout.flexBetween}>
                  <span>{item.date}</span>
                  <span>订单数: {item.orderCount}, 销售额: ¥{item.totalAmount.toFixed(2)}</span>
                </div>
              ))}
              {!dashboardData.salesTrend && (
                <div style={{ ...typography.textCenter, color: colors.textLight, padding: '2rem' }}>暂无销售数据</div>
              )}
            </div>
          </div>
        </div>
        <div style={containers.card}>
          <h3 style={typography.h3}>用户活跃度</h3>
          <div style={{ ...layout.flexColumn, ...layout.gap.md }}>
            {dashboardData.activeUsers ? (
              <>
                <div>
                  <div style={{ ...layout.flexBetween, ...layout.marginBottom.sm }}>
                    <span>总用户数</span>
                    <span>{dashboardData.activeUsers.total}</span>
                  </div>
                  <div style={progressBar.container}>
                    <div style={{ ...progressBar.fill, width: '100%', backgroundColor: colors.primary }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ ...layout.flexBetween, ...layout.marginBottom.sm }}>
                    <span>今日活跃</span>
                    <span>{dashboardData.activeUsers.today}</span>
                  </div>
                  <div style={progressBar.container}>
                    <div 
                      style={{ 
                        ...progressBar.fill, 
                        width: `${(dashboardData.activeUsers.today / (dashboardData.activeUsers.total || 1)) * 100}%`, 
                        backgroundColor: colors.success 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div style={{ ...layout.flexBetween, ...layout.marginBottom.sm }}>
                    <span>本周活跃</span>
                    <span>{dashboardData.activeUsers.week}</span>
                  </div>
                  <div style={progressBar.container}>
                    <div 
                      style={{ 
                        ...progressBar.fill, 
                        width: `${(dashboardData.activeUsers.week / (dashboardData.activeUsers.total || 1)) * 100}%`, 
                        backgroundColor: colors.warning 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div style={{ ...layout.flexBetween, ...layout.marginBottom.sm }}>
                    <span>本月活跃</span>
                    <span>{dashboardData.activeUsers.month}</span>
                  </div>
                  <div style={progressBar.container}>
                    <div 
                      style={{ 
                        ...progressBar.fill, 
                        width: `${(dashboardData.activeUsers.month / (dashboardData.activeUsers.total || 1)) * 100}%`, 
                        backgroundColor: colors.danger 
                      }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ ...typography.textCenter, color: colors.textLight, padding: '2rem' }}>暂无用户数据</div>
            )}
          </div>
        </div>
      </div>

      <div style={containers.card}>
        <h3 style={typography.h3}>热门商品 TOP 10</h3>
        <div style={layout.overflowX.auto}>
          <table style={tables.default}>
            <thead>
              <tr style={tables.header}>
                <th style={tables.headerCell}>排名</th>
                <th style={tables.headerCell}>商品图片</th>
                <th style={tables.headerCell}>商品名称</th>
                <th style={tables.headerCell}>价格</th>
                <th style={tables.headerCell}>销量</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.hotProducts && dashboardData.hotProducts.map((product, index) => (
                <tr key={product.id} style={tables.row}>
                  <td style={tables.cell}>{index + 1}</td>
                  <td style={tables.cell}>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={images.thumbnail}
                      />
                    ) : (
                      <div style={images.placeholder}></div>
                    )}
                  </td>
                  <td style={tables.cell}>{product.name}</td>
                  <td style={tables.cell}>¥{product.price.toFixed(2)}</td>
                  <td style={{ ...tables.cell, color: colors.danger, fontWeight: 'bold' }}>{product.totalSold}</td>
                </tr>
              ))}
              {(!dashboardData.hotProducts || dashboardData.hotProducts.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ ...tables.cell, padding: '30px', ...typography.textCenter, color: colors.textLight }}>暂无销售数据</td>
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