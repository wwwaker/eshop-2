package com.example.eshop.service;

import com.example.eshop.entity.Category;

import java.util.List;

/**
 * 商品分类服务层接口
 * 定义商品分类相关的业务操作方法
 */
public interface CategoryService {
    List<Category> findAll();
    Category findById(Long id);

    // 管理员系统方法
    void save(Category category);
    void deleteById(Long id);
}
