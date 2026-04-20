import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { ProductsView, ProductsPresenter } from '../contracts';
import { productsPresenter } from '../presenters';
import { typography, tables, layout, colors, alerts, buttons, loading as loadingStyles, status, inputs } from '../styles';

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
      <div style={{ ...layout.flexBetween, alignItems: 'center', ...layout.marginBottom.md }}>
        <h1 style={typography.h1}>商品管理</h1>
        <Link 
          to="/products/add" 
          style={buttons.add}
        >
          添加商品
        </Link>
      </div>

      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}

      <div style={layout.filterContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex' as const, flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="搜索商品名称或描述..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              presenter.onSearchTermChange(e.target.value);
            }}
            style={inputs.search}
          />
          <button
            type="submit"
            style={buttons.search}
          >
            搜索
          </button>
        </form>

        <div style={{ display: 'flex' as const, alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>状态：</label>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            style={inputs.select}
          >
            <option value="all">全部</option>
            <option value="ON_SALE">在售</option>
            <option value="OFF_SALE">下架</option>
          </select>
        </div>

        <div style={{ display: 'flex' as const, alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>分类：</label>
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            style={inputs.select}
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
          style={buttons.reset}
        >
          重置
        </button>
      </div>

      {loading ? (
        <div style={loadingStyles.container}>加载中...</div>
      ) : (
        <div style={layout.overflowX.auto}>
          <table style={tables.default}>
            <thead>
              <tr style={tables.header}>
                <th 
                  style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('id')}
                >
                  ID <span style={{ color: sortField === 'id' ? colors.primary : '#ccc', fontWeight: sortField === 'id' ? 'bold' : 'normal' }}>{sortField === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={tables.headerCell}>商品图片</th>
                <th 
                  style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('name')}
                >
                  商品名称 <span style={{ color: sortField === 'name' ? colors.primary : '#ccc', fontWeight: sortField === 'name' ? 'bold' : 'normal' }}>{sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th 
                  style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('price')}
                >
                  价格 <span style={{ color: sortField === 'price' ? colors.primary : '#ccc', fontWeight: sortField === 'price' ? 'bold' : 'normal' }}>{sortField === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th 
                  style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('stock')}
                >
                  库存 <span style={{ color: sortField === 'stock' ? colors.primary : '#ccc', fontWeight: sortField === 'stock' ? 'bold' : 'normal' }}>{sortField === 'stock' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th 
                  style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('categoryName')}
                >
                  分类 <span style={{ color: sortField === 'categoryName' ? colors.primary : '#ccc', fontWeight: sortField === 'categoryName' ? 'bold' : 'normal' }}>{sortField === 'categoryName' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={tables.headerCell}>状态</th>
                <th style={tables.headerCell}>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={tables.row}>
                  <td style={tables.cell}>{product.id}</td>
                  <td style={tables.cell}>
                    {product.imageUrl ? (
                      <img src={IMAGE_BASE_URL + product.imageUrl} alt={product.name} style={layout.product.image} />
                    ) : (
                      <div style={layout.product.noImage}>
                        无
                      </div>
                    )}
                  </td>
                  <td style={tables.cell}>{product.name}</td>
                  <td style={tables.cell}>¥{product.price.toFixed(2)}</td>
                  <td style={tables.cell}>{product.stock}</td>
                  <td style={tables.cell}>{product.categoryName}</td>
                  <td style={tables.cell}>
                    <span style={product.status === 'ON_SALE' ? status.onSale : status.offSale}>
                      {product.status === 'ON_SALE' ? '在售' : '下架'}
                    </span>
                  </td>
                  <td style={tables.cell}>
                    <div style={{ display: 'flex' as const, gap: '0.5rem' }}>
                      <Link 
                        to={`/products/edit/${product.id}`} 
                        style={buttons.smallSecondary}
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={buttons.smallDanger}
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