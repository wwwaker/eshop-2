package com.example.eshop.service;

import com.example.eshop.entity.Category;

import java.util.List;
import java.util.Map;

/**
 * 商品分类服务层接口
 * 定义商品分类相关的业务操作方法
 */
public interface CategoryService {
    List<Category> findAll();
    List<Category> findAllWithFilters(String search, String sortField, String sortOrder);
    Map<String, Object> findAllWithPagination(int page, int size, String search, String sortField, String sortOrder);
    Category findById(Long id);

    // 管理员系统方法
    void save(Category category);
    void deleteById(Long id);
}
