package com.example.eshop.service.impl;

import com.example.eshop.dao.ProductDao;
import com.example.eshop.entity.Product;
import com.example.eshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 商品服务实现类
 * 实现商品相关的业务逻辑，包括商品查询、搜索、库存管理等功能
 */
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductDao productDao;

    @Autowired
    public ProductServiceImpl(ProductDao productDao) {
        this.productDao = productDao;
    }

    @Override
    public List<Product> findAllOnSale() {
        return productDao.findAllOnSale();
    }

    @Override
    public List<Product> findByCategoryId(Long categoryId) {
        return productDao.findByCategoryId(categoryId);
    }

    @Override
    public List<Product> searchByName(String keyword) {
        return productDao.searchByName(keyword);
    }

    @Override
    public List<String> searchSuggestions(String keyword) {
        return productDao.searchSuggestions(keyword);
    }

    @Override
    public Product findById(Long id) {
        return productDao.findById(id);
    }

    @Override
    public List<Product> findAll() {
        return productDao.findAll();
    }

    @Override
    public List<Product> findAllWithFilters(String search, String sortField, String sortOrder, String status, Long categoryId) {
        return productDao.findAllWithFilters(search, sortField, sortOrder, status, categoryId);
    }

    @Override
    public void save(Product product) {
        if (product.getId() == null) {
            productDao.insert(product);
        } else {
            productDao.update(product);
        }
    }

    @Override
    public void deleteById(Long id) {
        productDao.deleteById(id);
    }

    @Override
    public void updateStock(Long id, int stock) {
        productDao.updateStock(id, stock);
    }

    @Override
    public int countTodayNewProducts() {
        return productDao.countTodayNewProducts();
    }

    @Override
    public List<Map<String, Object>> getSalesTrend(int days) {
        return productDao.getSalesTrend(days);
    }

    @Override
    public List<Map<String, Object>> getHotProducts(int limit) {
        return productDao.getHotProducts(limit);
    }

    @Override
    public int moveToCategory(Long fromCategoryId, Long toCategoryId) {
        return productDao.moveToCategory(fromCategoryId, toCategoryId);
    }
}
