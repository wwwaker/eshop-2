package com.example.eshop.service.impl;

import com.example.eshop.dao.ProductDao;
import com.example.eshop.entity.Product;
import com.example.eshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 商品服务实现类
 * 实现商品相关的业务逻辑，包括商品查询、搜索、库存管理等功能
 */
@Service
public class ProductServiceImpl implements ProductService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "price", "stock", "created_at", "updated_at", "status", "categoryName", "category_id");
    private static final Set<String> ALLOWED_SORT_ORDERS = Set.of("ASC", "DESC");

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

    private void validateSortParams(String sortField, String sortOrder) {
        if (sortField != null && !sortField.isEmpty() && !ALLOWED_SORT_FIELDS.contains(sortField)) {
            throw new RuntimeException("非法排序字段");
        }
        if (sortOrder != null && !sortOrder.isEmpty() && !ALLOWED_SORT_ORDERS.contains(sortOrder.toUpperCase())) {
            throw new RuntimeException("非法排序方向");
        }
    }

    @Override
    public List<Product> findAllWithFilters(String search, String sortField, String sortOrder, String status, Long categoryId) {
        validateSortParams(sortField, sortOrder);
        return productDao.findAllWithFilters(search, sortField, sortOrder, status, categoryId);
    }

    @Override
    public Map<String, Object> findAllWithPagination(int page, int size, String search, String sortField, String sortOrder, String status, Long categoryId) {
        validateSortParams(sortField, sortOrder);
        int offset = (page - 1) * size;
        List<Product> products = productDao.findAllWithPagination(offset, size, search, sortField, sortOrder, status, categoryId);
        int totalElements = productDao.countWithFilters(search, status, categoryId);
        int totalPages = (totalElements + size - 1) / size;
        
        Map<String, Object> result = new HashMap<>();
        result.put("content", products);
        result.put("totalElements", totalElements);
        result.put("totalPages", totalPages);
        result.put("page", page);
        result.put("size", size);
        
        return result;
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
