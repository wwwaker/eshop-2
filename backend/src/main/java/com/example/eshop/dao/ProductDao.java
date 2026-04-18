package com.example.eshop.dao;

import com.example.eshop.entity.Product;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * 商品数据访问层接口
 * 提供商品相关的数据库操作方法
 */
@Mapper
public interface ProductDao {
    List<Product> findAllOnSale();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> searchByName(String keyword);
    List<String> searchSuggestions(String keyword);
    Product findById(Long id);

    // 管理员系统方法
    List<Product> findAll();
    int insert(Product product);
    int update(Product product);
    int updateStock(Long id, int stock);
    int deleteById(Long id);
    int countTodayNewProducts();
    List<Map<String, Object>> getSalesTrend(int days);
    List<Map<String, Object>> getHotProducts(int limit);
    int moveToCategory(Long fromCategoryId, Long toCategoryId);
}
