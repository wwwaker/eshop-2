import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { CartView } from '../contracts';
import { cartPresenter } from '../presenters';
import { useUser } from '../context/UserContext';
import { containers, typography, inputs, buttons, images, tables, spacing, layout, colors, shadows } from '../styles';
import { pageStyles } from '../pageStyles';
import PageLoader from '../components/PageLoader';
import useDelayedLoading from '../hooks/useDelayedLoading';

const CartPage: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const view: CartView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (msg: string) => setError(msg),
    showCartItems: (items: CartItem[]) => setCartItems(items),
    showTotal: (t: number) => setTotal(t),
    showMessage: (msg: string, isError: boolean) => setMessage(msg),
    navigateToHome: () => navigate('/'),
    navigateToOrder: (orderId: number) => navigate(`/order/${orderId}`),
    showImageError: (productId: number) => setImageErrors(prev => ({ ...prev, [productId]: true }))
  }), [navigate]);

  useEffect(() => {
    cartPresenter.attachView(view);

    return () => {
      cartPresenter.detachView();
    };
  }, [view]);

  useEffect(() => {
    if (isAuthenticated && user) {
      cartPresenter.loadCartItems(user.id);
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (!user) return;
    if (newQuantity <= 0) {
      cartPresenter.removeItem(cartItemId, user.id);
      return;
    }
    cartPresenter.updateQuantity(cartItemId, user.id, newQuantity);
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (!user) return;
    cartPresenter.removeItem(cartItemId, user.id);
  };

  const handleClearCart = async () => {
    if (!user) return;
    cartPresenter.clearCart(user.id);
  };

  const handleCheckout = async () => {
    if (!user) return;
    cartPresenter.checkout(user.id, user.username, user.phone || '', user.address || '');
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const shouldShowLoader = useDelayedLoading(loading);

  if (!isAuthenticated) {
    return <div style={containers.errorContainer}>请先登录</div>;
  }

  if (loading && !shouldShowLoader) {
    return null;
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div style={containers.pageContainer}>
      <div style={pageStyles.heroSection}>
        <h1 style={{ ...typography.h1, ...pageStyles.heroTitle }}>购物车</h1>
        <p style={pageStyles.heroDescription}>已选商品 {cartItems.length} 件，确认后可一键结算。</p>
      </div>
      {message && (
        <div style={{ marginBottom: spacing.md, color: message.includes('失败') ? colors.danger : colors.success }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: spacing.md, color: colors.danger }}>
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div style={containers.emptyContainer}>
          <p>购物车为空</p>
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
        <>
          <div
            style={{
              ...containers.card,
              marginBottom: spacing.lg,
              ...pageStyles.tableCard
            }}
          >
          <table style={tables.default}>
            <thead style={tables.header}>
              <tr>
                <th style={tables.headerCell}>商品</th>
                <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>单价</th>
                <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>数量</th>
                <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>小计</th>
                <th style={{ ...tables.headerCell, textAlign: 'center' as const }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} style={tables.row}>
                  <td style={tables.cell}>
                    <div style={layout.flex.row}>
                      {item.product.imageUrl && !imageErrors[item.product.id] ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          onError={() => handleImageError(item.product.id)}
                          style={images.thumbnail}
                        />
                      ) : (
                        <div style={{ ...images.placeholder, width: '80px', height: '80px' }}>
                          无图片
                        </div>
                      )}
                      <div style={{ marginLeft: spacing.md }}>
                        <h3 style={typography.h3}>{item.product.name}</h3>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tables.cell, textAlign: 'center' as const }}>¥{item.product.price.toFixed(2)}</td>
                  <td style={{ ...tables.cell, textAlign: 'center' as const }}>
                    <div style={pageStyles.quantityStepper}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        style={{
                          ...buttons.quantity,
                          ...pageStyles.quantityButton
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.background = colors.accentSoft;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.background = colors.background;
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={item.product.stock}
                        style={{
                          ...inputs.number,
                          ...pageStyles.quantityInput
                        }}
                      />
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        style={{
                          ...buttons.quantity,
                          ...pageStyles.quantityButton
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.background = colors.accentSoft;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.background = colors.background;
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ ...tables.cell, textAlign: 'center' as const, fontWeight: 'bold' as const }}>
                    ¥{item.subtotal.toFixed(2)}
                  </td>
                  <td style={{ ...tables.cell, textAlign: 'center' as const }}>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={buttons.smallDanger}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.dangerHover || colors.danger}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.danger}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div
            style={{
              ...layout.flexBetween,
              ...containers.card,
              backgroundColor: '#ffffffd9',
              border: `1px solid ${colors.borderLight}`,
              boxShadow: shadows.sm
            }}
          >
            <button
              onClick={handleClearCart}
              style={buttons.secondary}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttons.secondaryHover)}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
            >
              清空购物车
            </button>
            <div style={{ textAlign: 'right' as const }}>
              <p style={{ fontSize: '1.2rem', margin: '0 0 0.8rem 0' }}>
                总计：<span style={{ fontWeight: 'bold', color: colors.danger }}>¥{total.toFixed(2)}</span>
              </p>
              <p style={{ margin: '0 0 1rem 0', color: colors.textSecondary, fontSize: '0.9rem' }}>
                含运费与优惠请以结算页为准
              </p>
              <button
                onClick={handleCheckout}
                style={buttons.success}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, buttons.successHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                去结账
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;