import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { CategoriesView, CategoriesPresenter } from '../contracts';
import { categoriesPresenter } from '../presenters';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const view: CategoriesView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showCategories: (categories: Category[]) => setCategories(categories),
    showDeleteSuccess: () => alert('删除成功'),
    showDeleteError: (message: string) => setError(message),
    refreshCategories: () => categoriesPresenter.loadCategories()
  }), []);

  const presenter: CategoriesPresenter = categoriesPresenter;

  useEffect(() => {
    presenter.attachView(view);
    presenter.loadCategories();

    return () => {
      presenter.detachView();
    };
  }, [presenter, view]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    presenter.searchCategories(searchTerm);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
    presenter.sortCategories(field, field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('确定删除吗？')) {
      presenter.deleteCategory(id);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSortField('id');
    setSortOrder('desc');
    presenter.resetFilters();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>分类管理</h1>
        <Link 
          to="/categories/add" 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          添加分类
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
            placeholder="搜索分类名称..."
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
                <th 
                  style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('name')}
                >
                  分类名称 <span style={{ color: sortField === 'name' ? '#007bff' : '#ccc', fontWeight: sortField === 'name' ? 'bold' : 'normal' }}>{sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>描述</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{category.id}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{category.name}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{category.description || '-'}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/categories/edit/${category.id}`} 
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
                        onClick={() => handleDelete(category.id)}
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

export default CategoriesPage;