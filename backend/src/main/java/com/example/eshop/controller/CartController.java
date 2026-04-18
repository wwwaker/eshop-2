package com.example.eshop.controller;

import com.example.eshop.entity.CartItem;
import com.example.eshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 购物车控制器
 * 处理购物车相关的HTTP请求，包括添加商品、修改数量、删除商品、清空购物车等功能
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.findByUserId(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> cartData) {
        Long userId = Long.valueOf(cartData.get("userId").toString());
        Long productId = Long.valueOf(cartData.get("productId").toString());
        Integer quantity = Integer.valueOf(cartData.get("quantity").toString());
        if (cartService.addToCart(userId, productId, quantity)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "已添加到购物车"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "添加失败，库存不足"));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateQuantity(@RequestBody Map<String, Object> cartData) {
        Long cartItemId = Long.valueOf(cartData.get("cartItemId").toString());
        Integer quantity = Integer.valueOf(cartData.get("quantity").toString());
        if (quantity > 0) {
            cartService.updateQuantity(cartItemId, quantity);
        } else {
            cartService.removeFromCart(cartItemId);
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/total/{userId}")
    public ResponseEntity<BigDecimal> getCartTotal(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartTotal(userId));
    }
}
