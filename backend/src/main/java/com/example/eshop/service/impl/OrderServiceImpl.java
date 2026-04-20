package com.example.eshop.service.impl;

import com.example.eshop.dao.OrderDao;
import com.example.eshop.dao.OrderItemDao;
import com.example.eshop.dao.ProductDao;
import com.example.eshop.entity.CartItem;
import com.example.eshop.entity.Order;
import com.example.eshop.entity.OrderItem;
import com.example.eshop.entity.Product;
import com.example.eshop.service.CartService;
import com.example.eshop.service.OrderService;
import com.example.eshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 订单服务实现类
 * 实现订单相关的业务逻辑，包括创建订单、查询订单、更新订单状态、库存扣减等功能
 */
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderDao orderDao;
    private final OrderItemDao orderItemDao;
    private final CartService cartService;
    private final ProductService productService;

    @Autowired
    public OrderServiceImpl(OrderDao orderDao, OrderItemDao orderItemDao, CartService cartService, ProductService productService) {
        this.orderDao = orderDao;
        this.orderItemDao = orderItemDao;
        this.cartService = cartService;
        this.productService = productService;
    }

    @Override
    @Transactional
    public Order createOrder(Long userId, String receiverName, String receiverPhone, String receiverAddress) {
        List<CartItem> cartItems = cartService.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("购物车为空");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setReceiverName(receiverName);
        order.setReceiverPhone(receiverPhone);
        order.setReceiverAddress(receiverAddress);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        orderDao.insert(order);

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("商品" + product.getName() + "库存不足");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setProductPrice(product.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSubtotal(cartItem.getSubtotal());

            orderItemDao.insert(orderItem);

            productService.updateStock(product.getId(), product.getStock() - cartItem.getQuantity());

            totalAmount = totalAmount.add(cartItem.getSubtotal());
        }

        order.setTotalAmount(totalAmount);
        orderDao.updateTotalAmount(order.getId(), totalAmount);

        cartService.clearCart(userId);

        return order;
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderDao.findByUserId(userId);
    }

    @Override
    public Order findById(Long id) {
        Order order = orderDao.findById(id);
        if (order != null) {
            order.setItems(orderItemDao.findByOrderId(id));
        }
        return order;
    }

    @Override
    public boolean updateStatus(Long orderId, String status) {
        return orderDao.updateStatus(orderId, status) > 0;
    }

    @Override
    public List<Order> findAll() {
        return orderDao.findAll();
    }

    @Override
    public List<Order> findAllWithFilters(String search, String sortField, String sortOrder, String status) {
        return orderDao.findAllWithFilters(search, sortField, sortOrder, status);
    }

    @Override
    public Map<String, Object> findAllWithPagination(int page, int size, String search, String sortField, String sortOrder, String status) {
        int offset = (page - 1) * size;
        List<Order> orders = orderDao.findAllWithPagination(offset, size, search, sortField, sortOrder, status);
        int totalElements = orderDao.countWithFilters(search, status);
        int totalPages = (totalElements + size - 1) / size;
        
        Map<String, Object> result = new HashMap<>();
        result.put("content", orders);
        result.put("totalElements", totalElements);
        result.put("totalPages", totalPages);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }

    @Override
    public void shipOrder(Long orderId) {
        orderDao.updateStatus(orderId, "SHIPPED");
    }

    @Override
    public int countTodayOrders() {
        return orderDao.countTodayOrders();
    }

    @Override
    public int countTodayNewUsers() {
        return orderDao.countTodayNewUsers();
    }

    @Override
    public Map<String, Object> getTodaySales() {
        return orderDao.getTodaySales();
    }

    @Override
    public Map<String, Object> getUserActivityStats() {
        return orderDao.getUserActivityStats();
    }

    private String generateOrderNo() {
        return "ORD" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
