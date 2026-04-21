import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ProductDetailView } from '../contracts';
import { productDetailPresenter } from '../presenters';
import { useUser } from '../context/UserContext';
import { containers, typography, inputs, buttons, images, status, spacing, layout, colors } from '../styles';

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

  const view: ProductDetailView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (msg: string) => setError(msg),
    showProduct: (p: Product) => setProduct(p),
    showAddToCartSuccess: () => {
      setMessage('已添加到购物车');
      setTimeout(() => setMessage(''), 2000);
    },
    showAddToCartError: (msg: string) => setMessage(msg),
    navigateToLogin: () => navigate('/login'),
    updateQuantity: (q: number) => setQuantity(q)
  }), [navigate]);

  useEffect(() => {
    productDetailPresenter.attachView(view);

    return () => {
      productDetailPresenter.detachView();
    };
  }, [view]);

  useEffect(() => {
    if (id) {
      productDetailPresenter.loadProduct(parseInt(id));
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (product) {
      productDetailPresenter.addToCart(user.id, product.id, quantity);
    }
  };

  if (loading) {
    return <div style={containers.loadingContainer}>加载中...</div>;
  }

  if (error || !product) {
    return <div style={containers.errorContainer}>{error || '商品不存在'}</div>;
  }

  return (
    <div style={containers.pageContainer}>
      <div style={layout.productDetail}>
        <div style={{ flex: 1 }}>
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imageUrl && !imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={() => setImageError(true)}
                style={images.productDetail}
              />
            ) : (
              <div style={images.placeholder}>
                无图片
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={typography.h1}>{product.name}</h1>
          <p style={{ color: colors.textSecondary, margin: spacing.md + ' 0' }}>{product.description}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.danger, margin: spacing.md + ' 0' }}>
            ¥{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </p>
          <div style={{ margin: spacing.md + ' 0', ...layout.flex.row, ...layout.gap.md }}>
            <label htmlFor="quantity" style={typography.label}>数量：</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={product.stock}
              style={inputs.number}
            />
            <span style={{ color: colors.textSecondary }}>库存：{product.stock}</span>
          </div>
          <button
            onClick={handleAddToCart}
            style={buttons.primary}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttons.primaryHover)}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
          >
            加入购物车
          </button>
          {message && (
            <div style={{ marginTop: spacing.md, color: message.includes('失败') ? colors.danger : colors.success }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;