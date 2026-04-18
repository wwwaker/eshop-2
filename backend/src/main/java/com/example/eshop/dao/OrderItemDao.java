package com.example.eshop.dao;

import com.example.eshop.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 订单项数据访问层接口
 * 提供订单项相关的数据库操作方法
 */
@Mapper
public interface OrderItemDao {
    int insert(OrderItem orderItem);
    List<OrderItem> findByOrderId(Long orderId);
}
