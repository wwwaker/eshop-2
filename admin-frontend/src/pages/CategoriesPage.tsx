import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * 分类类型定义
 * 包含分类的基本信息，如ID、名称和描述
 */
interface Category {
  id: number;
  name: string;
  description: string;
}

/**
 * 分类管理页面
 * 展示商品分类列表，提供添加、编辑、删除分类的功能
 */
const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * 获取分类列表
   * 从后端API获取所有分类数据
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/categories');
      setCategories(response.data);
      setError('');
    } catch (err: any) {
      setError('获取分类列表失败');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除分类
   * 弹出确认对话框，确认后从后端删除分类
   * @param id 分类ID
   */
  const handleDelete = async (id: number) => {
    if (window.confirm('确定删除吗？')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/categories/${id}`);
        fetchCategories();
      } catch (err: any) {
        setError('删除分类失败');
        console.error('Error deleting category:', err);
      }
    }
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

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>分类名称</th>
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