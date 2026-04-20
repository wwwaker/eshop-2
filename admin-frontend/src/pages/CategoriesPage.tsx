import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { CategoriesView, CategoriesPresenter } from '../contracts';
import { categoriesPresenter } from '../presenters';
import { typography, tables, layout, colors, alerts, buttons, loading as loadingStyles, inputs } from '../styles';

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
      <div style={{ ...layout.flexBetween, alignItems: 'center', ...layout.marginBottom.md }}>
        <h1 style={typography.h1}>分类管理</h1>
        <Link 
          to="/categories/add" 
          style={buttons.add}
        >
          添加分类
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
            placeholder="搜索分类名称..."
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
                <th 
                  style={{ ...tables.headerCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('name')}
                >
                  分类名称 <span style={{ color: sortField === 'name' ? colors.primary : '#ccc', fontWeight: sortField === 'name' ? 'bold' : 'normal' }}>{sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '▽'}</span>
                </th>
                <th style={tables.headerCell}>描述</th>
                <th style={tables.headerCell}>操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} style={tables.row}>
                  <td style={tables.cell}>{category.id}</td>
                  <td style={tables.cell}>{category.name}</td>
                  <td style={tables.cell}>{category.description || '-'}</td>
                  <td style={tables.cell}>
                    <div style={{ display: 'flex' as const, gap: '0.5rem' }}>
                      <Link 
                        to={`/categories/edit/${category.id}`} 
                        style={buttons.smallSecondary}
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
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

export default CategoriesPage;