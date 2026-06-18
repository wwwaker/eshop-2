package com.example.eshop.service.impl;

import com.example.eshop.config.CacheConst;
import com.example.eshop.dao.UserDao;
import com.example.eshop.entity.User;
import com.example.eshop.service.UserService;
import com.example.eshop.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 用户服务实现类
 * 实现用户相关的业务逻辑，包括登录、注册、密码加密等功能
 */
@Service
public class UserServiceImpl implements UserService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "username", "email", "phone", "role", "created_at", "updated_at");
    private static final Set<String> ALLOWED_SORT_ORDERS = Set.of("ASC", "DESC");

    private final UserDao userDao;
    private final JavaMailSender mailSender;
    private final String mailFrom;

    @Autowired
    public UserServiceImpl(UserDao userDao, JavaMailSender mailSender, @Value("${spring.mail.username}") String mailFrom) {
        this.userDao = userDao;
        this.mailSender = mailSender;
        this.mailFrom = mailFrom;
    }

    @Override
    public User login(String username, String password) {
        User user = userDao.findByUsername(username);
        if (user != null && PasswordUtil.matches(password, user.getPassword())) {
            // 旧SHA-256密码自动升级为BCrypt
            if (!PasswordUtil.isBCrypt(user.getPassword())) {
                user.setPassword(PasswordUtil.encrypt(password));
                userDao.update(user);
            }
            return user;
        }
        return null;
    }

    @Override
    @CacheEvict(value = CacheConst.USERS, allEntries = true)
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
    @Cacheable(value = CacheConst.USERS, key = "'username_'+#username", unless = "#result == null")
    public User findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    @Override
    @Cacheable(value = CacheConst.USERS, key = "'email_'+#email", unless = "#result == null")
    public User findByEmail(String email) {
        return userDao.findByEmail(email);
    }

    @Override
    @CacheEvict(value = CacheConst.USERS, allEntries = true)
    public boolean update(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userDao.update(user) > 0;
    }

    @Override
    public String sendRegisterCode(String email) {
        String code = String.format("%06d", (int) (Math.random() * 999999));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(email);
        message.setSubject("EShop注册验证码");
        message.setText("您的注册验证码是：" + code + "，有效期为5分钟。");

        mailSender.send(message);
        return code;
    }

    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }

    private void validateSortParams(String sortField, String sortOrder) {
        if (sortField != null && !sortField.isEmpty() && !ALLOWED_SORT_FIELDS.contains(sortField)) {
            throw new RuntimeException("非法排序字段");
        }
        if (sortOrder != null && !sortOrder.isEmpty() && !ALLOWED_SORT_ORDERS.contains(sortOrder.toUpperCase())) {
            throw new RuntimeException("非法排序方向");
        }
    }

    @Override
    public List<User> findAllWithFilters(String search, String sortField, String sortOrder, String role) {
        validateSortParams(sortField, sortOrder);
        return userDao.findAllWithFilters(search, sortField, sortOrder, role);
    }

    @Override
    public Map<String, Object> findAllWithPagination(int page, int size, String search, String sortField, String sortOrder, String role) {
        validateSortParams(sortField, sortOrder);
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
    @Cacheable(value = CacheConst.USERS, key = "'id_'+#id")
    public User findById(Long id) {
        return userDao.findById(id);
    }

    @Override
    @CacheEvict(value = CacheConst.USERS, allEntries = true)
    public void deleteById(Long id) {
        userDao.deleteById(id);
    }

    @Override
    @CacheEvict(value = CacheConst.USERS, allEntries = true)
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
