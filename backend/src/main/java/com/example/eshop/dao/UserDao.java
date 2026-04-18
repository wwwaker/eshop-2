package com.example.eshop.dao;

import com.example.eshop.entity.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 用户数据访问层接口
 * 提供用户相关的数据库操作方法
 */
@Mapper
public interface UserDao {
    User findByUsername(String username);
    User findByEmail(String email);
    int insert(User user);
    int update(User user);

    // 管理员系统方法
    List<User> findAll();
    User findById(Long id);
    int deleteById(Long id);
}
