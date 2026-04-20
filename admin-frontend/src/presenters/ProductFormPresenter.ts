import { Product } from '../types';
import { productApi, categoryApi, uploadApi } from '../services/api';
import { ProductFormView, ProductFormPresenter, ProductFormState } from '../contracts';
import { BasePresenterImpl } from './BasePresenterImpl';

export class ProductFormPresenterImpl extends BasePresenterImpl<ProductFormView> implements ProductFormPresenter {
  private state: ProductFormState = {
    product: null,
    categories: [],
    loading: false,
    error: '',
    success: '',
    imageUploading: false
  };

  attachView(view: ProductFormView): void {
    super.attachView(view);
  }

  loadCategories(): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    categoryApi.getAll()
      .then(response => {
        if (response.success && response.data) {
          this.state.categories = response.data;
          this.state.error = '';
          this.getView()?.showCategories(response.data);
        } else {
          this.state.error = '获取分类列表失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取分类列表失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  loadProduct(id: number): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    productApi.getById(id)
      .then(response => {
        if (response.success && response.data) {
          this.state.product = response.data;
          this.state.error = '';
          this.getView()?.showProduct(response.data);
        } else {
          this.state.error = '获取商品信息失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '获取商品信息失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  saveProduct(product: Product): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateProduct(product);
    if (validationErrors.length > 0) {
      this.getView()?.showError(validationErrors.join('\n'));
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    productApi.create(product)
      .then(response => {
        if (response.success) {
          this.state.success = '商品创建成功';
          this.getView()?.showSuccess('商品创建成功');
          setTimeout(() => {
            this.getView()?.navigateToProducts();
          }, 1000);
        } else {
          this.state.error = response.error || '商品创建失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '商品创建失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  updateProduct(id: number, product: Product): void {
    this.state.loading = true;
    this.getView()?.showLoading();

    const validationErrors = this.validateProduct(product);
    if (validationErrors.length > 0) {
      this.getView()?.showError(validationErrors.join('\n'));
      this.state.loading = false;
      this.getView()?.hideLoading();
      return;
    }

    productApi.update({ ...product, id })
      .then(response => {
        if (response.success) {
          this.state.success = '商品更新成功';
          this.getView()?.showSuccess('商品更新成功');
          setTimeout(() => {
            this.getView()?.navigateToProducts();
          }, 1000);
        } else {
          this.state.error = response.error || '商品更新失败';
          this.getView()?.showError(this.state.error);
        }
      })
      .catch((err: any) => {
        this.state.error = '商品更新失败';
        this.getView()?.showError(this.state.error);
      })
      .finally(() => {
        this.state.loading = false;
        this.getView()?.hideLoading();
      });
  }

  uploadImage(file: File): void {
    this.state.imageUploading = true;
    this.getView()?.showLoading();

    uploadApi.uploadImage(file)
      .then(response => {
        if (response.success && response.imageUrl) {
          this.getView()?.showImageUploadSuccess(response.imageUrl);
        } else {
          this.getView()?.showImageUploadError('图片上传失败');
        }
      })
      .catch((err: any) => {
        this.getView()?.showImageUploadError('图片上传失败');
      })
      .finally(() => {
        this.state.imageUploading = false;
        this.getView()?.hideLoading();
      });
  }

  validateProduct(product: Product): string[] {
    const errors: string[] = [];
    
    if (!product.name || product.name.trim() === '') {
      errors.push('商品名称不能为空');
    }
    
    if (!product.description || product.description.trim() === '') {
      errors.push('商品描述不能为空');
    }
    
    if (product.price <= 0) {
      errors.push('商品价格必须大于0');
    }
    
    if (product.stock < 0) {
      errors.push('商品库存不能为负数');
    }
    
    if (!product.categoryId || product.categoryId <= 0) {
      errors.push('请选择商品分类');
    }
    
    if (!product.imageUrl || product.imageUrl.trim() === '') {
      errors.push('请上传商品图片');
    }
    
    return errors;
  }

  resetForm(): void {
    this.state.product = null;
    this.state.error = '';
    this.state.success = '';
  }
}

export const productFormPresenter = new ProductFormPresenterImpl();