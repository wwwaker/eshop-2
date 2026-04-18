package com.example.eshop.service;

import com.example.eshop.entity.User;

import java.util.List;

/**
 * 用户服务层接口
 * 定义用户相关的业务操作方法
 */
public interface UserService {
    User login(String username, String password);
    boolean register(User user);
    User findByUsername(String username);
    User findByEmail(String email);
    boolean update(User user);
    void sendRegisterCode(String email);

    // 管理员系统方法
    List<User> findAll();
    User findById(Long id);
    void deleteById(Long id);
    void save(User user);
}
