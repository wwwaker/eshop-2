package com.example.eshop.service.impl;

import com.example.eshop.dao.CartItemDao;
import com.example.eshop.dao.ProductDao;
import com.example.eshop.entity.CartItem;
import com.example.eshop.entity.Product;
import com.example.eshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 购物车服务实现类
 * 实现购物车相关的业务逻辑，包括添加商品、修改数量、删除商品、清空购物车等功能
 */
@Service
public class CartServiceImpl implements CartService {

    private final CartItemDao cartItemDao;
    private final ProductDao productDao;

    @Autowired
    public CartServiceImpl(CartItemDao cartItemDao, ProductDao productDao) {
        this.cartItemDao = cartItemDao;
        this.productDao = productDao;
    }

    @Override
    public List<CartItem> findByUserId(Long userId) {
        List<CartItem> cartItems = cartItemDao.findByUserId(userId);
        for (CartItem item : cartItems) {
            Product product = productDao.findById(item.getProductId());
            item.setProduct(product);
        }
        return cartItems;
    }

    @Override
    public boolean addToCart(Long userId, Long productId, Integer quantity) {
        Product product = productDao.findById(productId);
        if (product == null || product.getStock() < quantity) {
            return false;
        }

        CartItem existingItem = cartItemDao.findByUserIdAndProductId(userId, productId);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setUpdatedAt(LocalDateTime.now());
            cartItemDao.update(existingItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUserId(userId);
            cartItem.setProductId(productId);
            cartItem.setQuantity(quantity);
            cartItem.setCreatedAt(LocalDateTime.now());
            cartItem.setUpdatedAt(LocalDateTime.now());
            cartItemDao.insert(cartItem);
        }
        return true;
    }

    @Override
    public void updateQuantity(Long cartItemId, Integer quantity) {
        CartItem cartItem = new CartItem();
        cartItem.setId(cartItemId);
        cartItem.setQuantity(quantity);
        cartItem.setUpdatedAt(LocalDateTime.now());
        cartItemDao.update(cartItem);
    }

    @Override
    public void removeFromCart(Long cartItemId) {
        cartItemDao.delete(cartItemId);
    }

    @Override
    public void clearCart(Long userId) {
        cartItemDao.deleteByUserId(userId);
    }

    @Override
    public BigDecimal getCartTotal(Long userId) {
        List<CartItem> cartItems = findByUserId(userId);
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            total = total.add(item.getSubtotal());
        }
        return total;
    }

    @Override
    public CartItem findById(Long id) {
        CartItem cartItem = cartItemDao.findById(id);
        if (cartItem != null) {
            Product product = productDao.findById(cartItem.getProductId());
            cartItem.setProduct(product);
        }
        return cartItem;
    }
}
