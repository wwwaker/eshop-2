package com.example.eshop.service;

import com.example.eshop.entity.Order;

import java.util.List;
import java.util.Map;

/**
 * 订单服务层接口
 * 定义订单相关的业务操作方法
 */
public interface OrderService {
    Order createOrder(Long userId, String receiverName, String receiverPhone, String receiverAddress);
    List<Order> findByUserId(Long userId);
    Order findById(Long id);
    boolean updateStatus(Long orderId, String status);

    // 管理员系统方法
    List<Order> findAll();
    void shipOrder(Long orderId);
    int countTodayOrders();
    int countTodayNewUsers();
    Map<String, Object> getTodaySales();
    Map<String, Object> getUserActivityStats();
}
