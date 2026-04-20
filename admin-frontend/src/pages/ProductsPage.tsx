import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { ProductsView, ProductsPresenter } from '../contracts';
import { productsPresenter } from '../presenters';

const IMAGE_BASE_URL = 'http://localhost:3000';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);

  const view: ProductsView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showProducts: (products: Product[]) => setProducts(products),
    showCategories: (categories: Category[]) => setCategories(categories),
    showDeleteSuccess: () => alert('删除成功'),
    showDeleteError: (message: string) => setError(message),
    navigateToAddProduct: () => {},
    navigateToEditProduct: (id: number) => {},
    refreshProducts: () => productsPresenter.loadProducts()
  }), []);

  const presenter: ProductsPresenter = productsPresenter;

  useEffect(() => {
    presenter.attachView(view);
    presenter.loadCategories();
    presenter.loadProducts();

    return () => {
      presenter.detachView();
    };
  }, [presenter, view]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    presenter.searchProducts(searchTerm);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
    presenter.sortProducts(field, field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    presenter.onStatusFilterChange(status);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setCategoryFilter(categoryId);
    presenter.onCategoryFilterChange(categoryId);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定删除吗？')) {
      presenter.deleteProduct(id);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSortField('id');
    setSortOrder('desc');
    setStatusFilter('all');
    setCategoryFilter('all');
    presenter.resetFilters();
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

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="搜索商品名称..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              presenter.onSearchTermChange(e.target.value);
            }}
            style={{
              flex: '1',
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px 0 0 4px',
              fontSize: '0.9rem'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: '1px solid #007bff',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer'
            }}
          >
            搜索
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>状态：</label>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            style={{
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">全部</option>
            <option value="ON_SALE">在售</option>
            <option value="OFF_SALE">下架</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>分类：</label>
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            style={{
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">全部</option>
            {categories.map(category => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: '1px solid #6c757d',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          重置
        </button>
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('id')}
                >
                  ID <span style={{ color: sortField === 'id' ? '#007bff' : '#ccc', fontWeight: sortField === 'id' ? 'bold' : 'normal' }}>{sortField === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>商品图片</th>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('name')}
                >
                  商品名称 <span style={{ color: sortField === 'name' ? '#007bff' : '#ccc', fontWeight: sortField === 'name' ? 'bold' : 'normal' }}>{sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('price')}
                >
                  价格 <span style={{ color: sortField === 'price' ? '#007bff' : '#ccc', fontWeight: sortField === 'price' ? 'bold' : 'normal' }}>{sortField === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('stock')}
                >
                  库存 <span style={{ color: sortField === 'stock' ? '#007bff' : '#ccc', fontWeight: sortField === 'stock' ? 'bold' : 'normal' }}>{sortField === 'stock' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('categoryName')}
                >
                  分类 <span style={{ color: sortField === 'categoryName' ? '#007bff' : '#ccc', fontWeight: sortField === 'categoryName' ? 'bold' : 'normal' }}>{sortField === 'categoryName' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
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