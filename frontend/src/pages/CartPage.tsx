import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartApi, orderApi } from '../services/api';
import { CartItem } from '../types';
import { useUser } from '../context/UserContext';

/**
 * 购物车页面组件
 * 展示用户的购物车商品列表，提供修改数量、删除商品、清空购物车和结账功能
 */
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

  useEffect(() => {
    if (isAuthenticated) {
      loadCartItems();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user]);

  const loadCartItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const items = await cartApi.getItems(user.id);
      setCartItems(items);
      const cartTotal = await cartApi.getTotal(user.id);
      setTotal(cartTotal);
    } catch (err) {
      setError('加载购物车失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      await cartApi.updateQuantity(cartItemId, newQuantity);
      loadCartItems();
    } catch (err) {
      setMessage('更新失败');
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await cartApi.removeItem(cartItemId);
      loadCartItems();
    } catch (err) {
      setMessage('删除失败');
    }
  };

  const handleClearCart = async () => {
    if (!user) return;
    try {
      await cartApi.clearCart(user.id);
      setCartItems([]);
      setTotal(0);
    } catch (err) {
      setMessage('清空失败');
    }
  };

  const handleCheckout = async () => {
    if (!user) return;

    setCheckoutLoading(true);
    try {
      const order = await orderApi.create(
        user.id,
        user.username,
        user.phone || '',
        user.address || ''
      );
      setMessage('订单创建成功');
      loadCartItems();
      setTimeout(() => navigate(`/order/${order.id}`), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.error || '结账失败');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>请先登录</div>;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>购物车</h1>
      {message && (
        <div style={{ marginBottom: '1rem', color: message.includes('失败') ? 'red' : 'green' }}>
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>购物车为空</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            去购物
          </button>
        </div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>商品</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>单价</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>数量</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>小计</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {item.product.imageUrl && !imageErrors[item.product.id] ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          onError={() => handleImageError(item.product.id)}
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          无图片
                        </div>
                      )}
                      <div>
                        <h3 style={{ margin: '0' }}>{item.product.name}</h3>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>¥{item.product.price.toFixed(2)}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        style={{ width: '30px', height: '30px', textAlign: 'center' }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={item.product.stock}
                        style={{ width: '60px', textAlign: 'center' }}
                      />
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        style={{ width: '30px', height: '30px', textAlign: 'center' }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                    ¥{item.subtotal.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handleClearCart}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              清空购物车
            </button>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '1.2rem', margin: '0 0 1rem 0' }}>
                总计：<span style={{ fontWeight: 'bold', color: '#dc3545' }}>¥{total.toFixed(2)}</span>
              </p>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                style={{
                  padding: '0.8rem 2rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
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
