import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * 商品类型定义
 * 包含商品的基本信息，如ID、名称、价格、库存、分类、图片和状态
 */
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  status: string;
}

/**
 * 图片基础URL
 * 用于构建商品图片的完整URL
 */
const IMAGE_BASE_URL = 'http://localhost:3000';

/**
 * 商品管理页面
 * 展示商品列表，提供添加、编辑、删除商品的功能
 */
const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * 获取商品列表
   * 从后端API获取所有商品数据
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/products');
      setProducts(response.data);
      setError('');
    } catch (err: any) {
      setError('获取商品列表失败');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除商品
   * 弹出确认对话框，确认后从后端删除商品
   * @param id 商品ID
   */
  const handleDelete = async (id: number) => {
    if (window.confirm('确定删除吗？')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/products/${id}`);
        fetchProducts();
      } catch (err: any) {
        setError('删除商品失败');
        console.error('Error deleting product:', err);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>商品管理</h1>
        <Link 
          to="/products/add" 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          添加商品
        </Link>
      </div>

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
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>商品图片</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>商品名称</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>价格</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>库存</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>分类</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>状态</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{product.id}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    {product.imageUrl ? (
                      <img src={IMAGE_BASE_URL + product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        无
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{product.name}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>¥{product.price.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{product.stock}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{product.categoryName}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: product.status === 'ON_SALE' ? '#d4edda' : '#f8d7da',
                      color: product.status === 'ON_SALE' ? '#155724' : '#721c24'
                    }}>
                      {product.status === 'ON_SALE' ? '在售' : '下架'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/products/edit/${product.id}`} 
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        删除
                      </button>
                    </div>
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

export default ProductsPage;