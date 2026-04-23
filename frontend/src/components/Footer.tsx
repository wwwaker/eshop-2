import React from 'react';
import { Link } from 'react-router-dom';
import { colors, spacing, borders } from '../styles';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: spacing.xl,
        padding: `${spacing.xl} ${spacing.xl}`,
        borderTop: `1px solid ${colors.borderLight}`,
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: spacing.lg,
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: colors.text, marginBottom: spacing.xs }}>EShop 商城</div>
          <div style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>精选商品 · 安心交易 · 快速配送</div>
        </div>
        <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: colors.textSecondary,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borders.radius.sm
            }}
          >
            首页
          </Link>
          <Link
            to="/orders"
            style={{
              textDecoration: 'none',
              color: colors.textSecondary,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borders.radius.sm
            }}
          >
            我的订单
          </Link>
          <Link
            to="/profile"
            style={{
              textDecoration: 'none',
              color: colors.textSecondary,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borders.radius.sm
            }}
          >
            个人中心
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
