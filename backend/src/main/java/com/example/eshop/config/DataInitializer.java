package com.example.eshop.config;

import com.example.eshop.entity.User;
import com.example.eshop.service.UserService;
import com.example.eshop.util.PasswordUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * 数据初始化器
 * 在应用启动时自动初始化默认的管理员账号和普通用户账号
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final UserService userService;

    public DataInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("开始初始化默认账号...");

        initDefaultUsers();

        logger.info("默认账号初始化完成");
    }

    private void initDefaultUsers() {
        createAdminUser();
        createNormalUser();
    }

    private void createAdminUser() {
        String adminUsername = "admin";
        String adminPassword = "admin123";

        User existingAdmin = userService.findByUsername(adminUsername);
        if (existingAdmin == null) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setPassword(PasswordUtil.encrypt(adminPassword));
            admin.setEmail("admin@eshop.com");
            admin.setRole("ADMIN");
            admin.setCreatedAt(java.time.LocalDateTime.now());
            admin.setUpdatedAt(java.time.LocalDateTime.now());

            userService.register(admin);
            logger.info("管理员账号创建成功: {}", adminUsername);
        } else {
            logger.info("管理员账号已存在: {}", adminUsername);
        }
    }

    private void createNormalUser() {
        String username = "user";
        String password = "user123";

        User existingUser = userService.findByUsername(username);
        if (existingUser == null) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(PasswordUtil.encrypt(password));
            user.setEmail("user@eshop.com");
            user.setRole("USER");
            user.setCreatedAt(java.time.LocalDateTime.now());
            user.setUpdatedAt(java.time.LocalDateTime.now());

            userService.register(user);
            logger.info("普通用户账号创建成功: {}", username);
        } else {
            logger.info("普通用户账号已存在: {}", username);
        }
    }
}
