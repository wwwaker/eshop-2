package com.example.eshop.dao;

import com.example.eshop.entity.Category;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 商品分类数据访问层接口
 * 提供商品分类相关的数据库操作方法
 */
@Mapper
public interface CategoryDao {
    List<Category> findAll();
    Category findById(Long id);

    // 管理员系统方法
    int insert(Category category);
    int update(Category category);
    int deleteById(Long id);
}
