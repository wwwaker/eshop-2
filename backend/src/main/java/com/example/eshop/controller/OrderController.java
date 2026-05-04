package com.example.eshop.controller;

import com.example.eshop.entity.Order;
import com.example.eshop.entity.User;
import com.example.eshop.service.OrderService;
import jakarta.servlet.http.HttpSession;
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

    private User getCurrentUser(HttpSession session) {
        return (User) session.getAttribute("LOGGED_IN_USER");
    }

    private boolean isAdmin(User user) {
        return user != null && "ADMIN".equals(user.getRole());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData, HttpSession session) {
        User currentUser = getCurrentUser(session);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录"));
        }
        Long userId = Long.valueOf(orderData.get("userId").toString());
        if (!isAdmin(currentUser) && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).body(Map.of("error", "无权为他人创建订单"));
        }
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
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId, HttpSession session) {
        User currentUser = getCurrentUser(session);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录"));
        }
        if (!isAdmin(currentUser) && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).body(Map.of("error", "无权查看他人订单"));
        }
        return ResponseEntity.ok(orderService.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id, HttpSession session) {
        User currentUser = getCurrentUser(session);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录"));
        }
        Order order = orderService.findById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        if (!isAdmin(currentUser) && !currentUser.getId().equals(order.getUserId())) {
            return ResponseEntity.status(403).body(Map.of("error", "无权查看此订单"));
        }
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData, HttpSession session) {
        User currentUser = getCurrentUser(session);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录"));
        }
        Order order = orderService.findById(id);
        if (order == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "订单不存在"));
        }
        if (!isAdmin(currentUser) && !currentUser.getId().equals(order.getUserId())) {
            return ResponseEntity.status(403).body(Map.of("error", "无权修改此订单状态"));
        }
        String status = statusData.get("status");
        if (orderService.updateStatus(id, status)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "状态更新成功"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "状态更新失败"));
        }
    }

    // 管理员系统接口
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllOrders(HttpSession session) {
        User currentUser = getCurrentUser(session);
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(403).body(Map.of("error", "需要管理员权限"));
        }
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/admin/paginated")
    public ResponseEntity<?> getOrdersWithPagination(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) String status,
            HttpSession session) {
        User currentUser = getCurrentUser(session);
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(403).body(Map.of("error", "需要管理员权限"));
        }
        return ResponseEntity.ok(orderService.findAllWithPagination(page, size, search, sortField, sortOrder, status));
    }
}
