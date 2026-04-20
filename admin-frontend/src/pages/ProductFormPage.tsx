import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product, Category } from '../types';
import { ProductFormView, ProductFormPresenter } from '../contracts';
import { productFormPresenter } from '../presenters';

const IMAGE_BASE_URL = 'http://localhost:3000';

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    description: '',
    imageUrl: '',
    status: 'ON_SALE'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const view: ProductFormView = useMemo(() => ({
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showSuccess: (message: string) => setSuccess(message),
    showCategories: (categories: Category[]) => setCategories(categories),
    showProduct: (product: Product) => setFormData(product),
    navigateToProducts: () => navigate('/products'),
    updateFormData: (data: Product) => setFormData(data),
    updateCategories: (categories: Category[]) => setCategories(categories),
    showImagePreview: (url: string) => setFormData(prev => ({ ...prev, imageUrl: url })),
    showImageUploadError: (message: string) => setError(message),
    showImageUploadSuccess: (url: string) => setFormData(prev => ({ ...prev, imageUrl: url }))
  }), [navigate]);

  const presenter: ProductFormPresenter = productFormPresenter;

  useEffect(() => {
    presenter.attachView(view);
    presenter.loadCategories();
    if (isEdit && id) {
      presenter.loadProduct(Number(id));
    } else {
      setLoading(false);
    }

    return () => {
      presenter.detachView();
    };
  }, [id, isEdit, presenter, view]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // 上传图片
      if (imageFile) {
        presenter.uploadImage(imageFile);
        // 图片上传成功后会通过 showImageUploadSuccess 回调更新 formData
      }

      // 提交商品信息
      if (isEdit && id) {
        presenter.updateProduct(Number(id), formData as Product);
      } else {
        presenter.saveProduct(formData as Product);
      }
    } catch (err) {
      setError(isEdit ? '商品更新失败' : '商品添加失败');
    }
  };

  return (
    <div>
      <h1>{isEdit ? '编辑商品' : '添加商品'}</h1>

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
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>商品名称</label>
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
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>价格</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>库存</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>分类</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            >
              <option value="">请选择分类</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>商品描述</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>图片URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>上传图片</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>

          {formData.imageUrl && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>图片预览</label>
              <img 
                src={IMAGE_BASE_URL + formData.imageUrl} 
                alt="预览" 
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', border: '1px solid #ced4da', borderRadius: '4px' }} 
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>状态</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
            >
              <option value="ON_SALE">在售</option>
              <option value="OFF_SALE">下架</option>
            </select>
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
              {isEdit ? '更新商品' : '添加商品'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
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

export default ProductFormPage;