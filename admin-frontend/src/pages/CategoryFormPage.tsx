import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Category } from '../types';
import { CategoryFormView, CategoryFormPresenter } from '../contracts';
import { categoryFormPresenter } from '../presenters';
import { typography, layout, alerts, inputs, buttons, loading as loadingStyles } from '../styles';

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
      <h1 style={typography.h1}>{isEdit ? '编辑分类' : '添加分类'}</h1>

      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}

      {success && (
        <div style={alerts.success}>
          {success}
        </div>
      )}

      {loading ? (
        <div style={loadingStyles.container}>加载中...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={layout.marginBottom.sm}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>分类名称</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ ...inputs.default, width: '100%' }}
            />
          </div>

          <div style={layout.marginBottom.sm}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>分类描述</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{ ...inputs.default, width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex' as const, gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              style={buttons.primary}
            >
              {isEdit ? '更新分类' : '添加分类'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/categories')}
              style={buttons.secondary}
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