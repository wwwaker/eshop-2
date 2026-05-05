package com.example.eshop.service.impl;

import com.example.eshop.dao.CategoryDao;
import com.example.eshop.entity.Category;
import com.example.eshop.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 商品分类服务实现类
 * 实现商品分类相关的业务逻辑，包括分类的增删改查等功能
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "created_at", "updated_at");
    private static final Set<String> ALLOWED_SORT_ORDERS = Set.of("ASC", "DESC");

    private final CategoryDao categoryDao;

    @Autowired
    public CategoryServiceImpl(CategoryDao categoryDao) {
        this.categoryDao = categoryDao;
    }

    @Override
    public List<Category> findAll() {
        return categoryDao.findAll();
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
    public List<Category> findAllWithFilters(String search, String sortField, String sortOrder) {
        validateSortParams(sortField, sortOrder);
        return categoryDao.findAllWithFilters(search, sortField, sortOrder);
    }

    @Override
    public Map<String, Object> findAllWithPagination(int page, int size, String search, String sortField, String sortOrder) {
        validateSortParams(sortField, sortOrder);
        int offset = (page - 1) * size;
        List<Category> categories = categoryDao.findAllWithPagination(offset, size, search, sortField, sortOrder);
        int totalElements = categoryDao.countWithFilters(search);
        int totalPages = (totalElements + size - 1) / size;
        
        Map<String, Object> result = new HashMap<>();
        result.put("content", categories);
        result.put("totalElements", totalElements);
        result.put("totalPages", totalPages);
        result.put("page", page);
        result.put("size", size);
        
        return result;
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
