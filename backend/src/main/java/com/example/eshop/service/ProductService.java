package com.example.eshop.service;

import com.example.eshop.entity.Product;

import java.util.List;
import java.util.Map;

/**
 * 商品服务层接口
 * 定义商品相关的业务操作方法
 */
public interface ProductService {
    List<Product> findAllOnSale();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> searchByName(String keyword);
    List<String> searchSuggestions(String keyword);
    Product findById(Long id);

    // 管理员系统方法
    List<Product> findAll();
    List<Product> findAllWithFilters(String search, String sortField, String sortOrder, String status, Long categoryId);
    void save(Product product);
    void deleteById(Long id);
    void updateStock(Long id, int stock);
    int countTodayNewProducts();
    List<Map<String, Object>> getSalesTrend(int days);
    List<Map<String, Object>> getHotProducts(int limit);
    int moveToCategory(Long fromCategoryId, Long toCategoryId);
}
