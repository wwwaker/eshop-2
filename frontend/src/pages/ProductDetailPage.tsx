import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, cartApi } from '../services/api';
import { Product } from '../types';
import { useUser } from '../context/UserContext';

/**
 * 商品详情页面组件
 * 展示单个商品的详细信息，提供加入购物车功能
 */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productApi.getById(parseInt(id!));
      setProduct(data);
    } catch (err) {
      setError('加载商品失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await cartApi.addItem(user!.id, product!.id, quantity);
      if (response.success) {
        setMessage('已添加到购物车');
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage(response.message || '添加失败');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || '添加失败');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>;
  }

  if (error || !product) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error || '商品不存在'}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imageUrl && !imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={() => setImageError(true)}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                无图片
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h1>{product.name}</h1>
          <p style={{ color: '#666', margin: '1rem 0' }}>{product.description}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545', margin: '1rem 0' }}>
            ¥{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </p>
          <div style={{ margin: '1rem 0' }}>
            <label htmlFor="quantity">数量：</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={product.stock}
              style={{ width: '60px', padding: '0.5rem' }}
            />
            <span style={{ marginLeft: '1rem', color: '#666' }}>库存：{product.stock}</span>
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            加入购物车
          </button>
          {message && (
            <div style={{ marginTop: '1rem', color: message.includes('失败') ? 'red' : 'green' }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
