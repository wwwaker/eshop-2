import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { CartView } from '../contracts';
import { cartPresenter } from '../presenters';
import { useUser } from '../context/UserContext';
import { containers, typography, inputs, buttons, images, tables, spacing, layout, colors } from '../styles';

const CartPage: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
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
  }, [isAuthenticated, user]);

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

  if (!isAuthenticated) {
    return <div style={containers.errorContainer}>请先登录</div>;
  }

  if (loading) {
    return <div style={containers.loadingContainer}>加载中...</div>;
  }

  return (
    <div style={containers.pageContainer}>
      <h1 style={typography.h1}>购物车</h1>
      {message && (
        <div style={{ marginBottom: spacing.md, color: message.includes('失败') ? colors.danger : colors.success }}>
          {message}
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
                    <div style={{ ...layout.flex.row, justifyContent: 'center' as const, ...layout.gap.sm }}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        style={buttons.quantity}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={item.product.stock}
                        style={inputs.number}
                      />
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        style={buttons.quantity}
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

          <div style={layout.flexBetween}>
            <button
              onClick={handleClearCart}
              style={buttons.secondary}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttons.secondaryHover)}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
            >
              清空购物车
            </button>
            <div style={{ textAlign: 'right' as const }}>
              <p style={{ fontSize: '1.2rem', margin: '0 0 1rem 0' }}>
                总计：<span style={{ fontWeight: 'bold', color: colors.danger }}>¥{total.toFixed(2)}</span>
              </p>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                style={checkoutLoading ? buttons.disabled : buttons.success}
                onMouseEnter={(e) => {
                  if (!checkoutLoading) {
                    Object.assign(e.currentTarget.style, buttons.successHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!checkoutLoading) {
                    e.currentTarget.style.backgroundColor = '';
                  }
                }}
              >
                {checkoutLoading ? '结账中...' : '去结账'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;