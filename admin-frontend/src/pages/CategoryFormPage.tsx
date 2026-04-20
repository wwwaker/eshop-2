import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Category } from '../types';
import { CategoryFormView, CategoryFormPresenter } from '../contracts';
import { categoryFormPresenter } from '../presenters';

const CategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const view: CategoryFormView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showSuccess: (message: string) => setSuccess(message),
    showCategory: (category: Category) => setFormData(category),
    navigateToCategories: () => navigate('/categories'),
    updateFormData: (data: Category) => setFormData(data)
  }), [navigate]);

  const presenter: CategoryFormPresenter = categoryFormPresenter;

  useEffect(() => {
    presenter.attachView(view);
    if (isEdit && id) {
      presenter.loadCategory(Number(id));
    } else {
      setLoading(false);
    }

    return () => {
      presenter.detachView();
    };
  }, [id, isEdit, presenter, view]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEdit && id) {
        presenter.updateCategory(Number(id), formData as Category);
      } else {
        presenter.saveCategory(formData as Category);
      }
    } catch (err) {
      setError(isEdit ? '分类更新失败' : '分类添加失败');
    }
  };

  return (
    <div>
      <h1>{isEdit ? '编辑分类' : '添加分类'}</h1>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      {loading ? (
        <div>加载中...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>分类名称</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>分类描述</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {isEdit ? '更新分类' : '添加分类'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/categories')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CategoryFormPage;