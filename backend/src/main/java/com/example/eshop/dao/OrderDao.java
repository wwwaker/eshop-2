package com.example.eshop.dao;

import com.example.eshop.entity.Order;
import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 订单数据访问层接口
 * 提供订单相关的数据库操作方法
 */
@Mapper
public interface OrderDao {
    int insert(Order order);
    List<Order> findByUserId(Long userId);
    Order findById(Long id);
    int updateStatus(Long orderId, String status);
    int updateTotalAmount(Long orderId, BigDecimal totalAmount);

    // 管理员系统方法
    List<Order> findAll();
    List<Order> findAllWithFilters(String search, String sortField, String sortOrder, String status);
    int countTodayOrders();
    int countTodayNewUsers();
    Map<String, Object> getTodaySales();
    Map<String, Object> getUserActivityStats();
}
