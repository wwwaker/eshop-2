package com.example.eshop.service.impl;

import com.example.eshop.dao.CategoryDao;
import com.example.eshop.entity.Category;
import com.example.eshop.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 商品分类服务实现类
 * 实现商品分类相关的业务逻辑，包括分类的增删改查等功能
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryDao categoryDao;

    @Autowired
    public CategoryServiceImpl(CategoryDao categoryDao) {
        this.categoryDao = categoryDao;
    }

    @Override
    public List<Category> findAll() {
        return categoryDao.findAll();
    }

    @Override
    public Category findById(Long id) {
        return categoryDao.findById(id);
    }

    @Override
    public void save(Category category) {
        if (category.getId() == null) {
            categoryDao.insert(category);
        } else {
            categoryDao.update(category);
        }
    }

    @Override
    public void deleteById(Long id) {
        categoryDao.deleteById(id);
    }
}
