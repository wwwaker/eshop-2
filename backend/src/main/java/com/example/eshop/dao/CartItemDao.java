package com.example.eshop.dao;

import com.example.eshop.entity.CartItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 购物车数据访问层接口
 * 提供购物车相关的数据库操作方法
 */
@Mapper
public interface CartItemDao {
    List<CartItem> findByUserId(Long userId);
    CartItem findByUserIdAndProductId(Long userId, Long productId);
    CartItem findById(Long id);
    int insert(CartItem cartItem);
    int update(CartItem cartItem);
    int delete(Long id);
    int deleteByUserId(Long userId);
}
