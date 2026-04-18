package com.example.eshop.service;

import com.example.eshop.entity.CartItem;

import java.math.BigDecimal;
import java.util.List;

/**
 * 购物车服务层接口
 * 定义购物车相关的业务操作方法
 */
public interface CartService {
    List<CartItem> findByUserId(Long userId);
    boolean addToCart(Long userId, Long productId, Integer quantity);
    void updateQuantity(Long cartItemId, Integer quantity);
    void removeFromCart(Long cartItemId);
    void clearCart(Long userId);
    BigDecimal getCartTotal(Long userId);
    CartItem findById(Long id);
}
