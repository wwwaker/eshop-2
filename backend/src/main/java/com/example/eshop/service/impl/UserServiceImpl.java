package com.example.eshop.service.impl;

import com.example.eshop.dao.UserDao;
import com.example.eshop.entity.User;
import com.example.eshop.service.UserService;
import com.example.eshop.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户服务实现类
 * 实现用户相关的业务逻辑，包括登录、注册、密码加密等功能
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;
    private final JavaMailSender mailSender;

    @Autowired
    public UserServiceImpl(UserDao userDao, JavaMailSender mailSender) {
        this.userDao = userDao;
        this.mailSender = mailSender;
    }

    @Override
    public User login(String username, String password) {
        User user = userDao.findByUsername(username);
        if (user != null && PasswordUtil.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    @Override
    public boolean register(User user) {
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        user.setPassword(PasswordUtil.encrypt(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userDao.insert(user) > 0;
    }

    @Override
    public User findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    @Override
    public User findByEmail(String email) {
        return userDao.findByEmail(email);
    }

    @Override
    public boolean update(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userDao.update(user) > 0;
    }

    @Override
    public void sendRegisterCode(String email) {
        String code = String.format("%06d", (int) (Math.random() * 999999));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("EShop注册验证码");
        message.setText("您的注册验证码是：" + code + "，有效期为5分钟。");

        mailSender.send(message);
    }

    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }

    @Override
    public List<User> findAllWithFilters(String search, String sortField, String sortOrder, String role) {
        return userDao.findAllWithFilters(search, sortField, sortOrder, role);
    }

    @Override
    public Map<String, Object> findAllWithPagination(int page, int size, String search, String sortField, String sortOrder, String role) {
        int offset = (page - 1) * size;
        List<User> users = userDao.findAllWithPagination(offset, size, search, sortField, sortOrder, role);
        int totalElements = userDao.countWithFilters(search, role);
        int totalPages = (totalElements + size - 1) / size;
        
        Map<String, Object> result = new HashMap<>();
        result.put("content", users);
        result.put("totalElements", totalElements);
        result.put("totalPages", totalPages);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }

    @Override
    public User findById(Long id) {
        return userDao.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        userDao.deleteById(id);
    }

    @Override
    public void save(User user) {
        if (user.getId() == null) {
            if (user.getRole() == null) {
                user.setRole("USER");
            }
            user.setPassword(PasswordUtil.encrypt(user.getPassword()));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userDao.insert(user);
        } else {
            user.setUpdatedAt(LocalDateTime.now());
            userDao.update(user);
        }
    }
}
