package com.example.eshop.controller;

import com.example.eshop.entity.Order;
import com.example.eshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 订单控制器
 * 处理订单相关的HTTP请求，包括创建订单、查询订单、更新订单状态等功能
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        Long userId = Long.valueOf(orderData.get("userId").toString());
        String receiverName = orderData.get("receiverName").toString();
        String receiverPhone = orderData.get("receiverPhone").toString();
        String receiverAddress = orderData.get("receiverAddress").toString();
        try {
            Order order = orderService.createOrder(userId, receiverName, receiverPhone, receiverAddress);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.findById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        String status = statusData.get("status");
        if (orderService.updateStatus(id, status)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "状态更新成功"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "状态更新失败"));
        }
    }
}
