package com.example.eshop.controller;

import com.example.eshop.entity.User;
import com.example.eshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 用户控制器
 * 处理用户相关的HTTP请求，包括登录、注册、个人信息更新等功能
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        User user = userService.login(username, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "用户名或密码错误"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "用户名已存在"));
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "邮箱已存在"));
        }
        if (userService.register(user)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "注册成功"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "注册失败"));
        }
    }

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> emailData) {
        String email = emailData.get("email");
        try {
            userService.sendRegisterCode(email);
            return ResponseEntity.ok(Map.of("success", true, "message", "验证码已发送"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "验证码发送失败"));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User user) {
        if (userService.update(user)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "更新成功"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "更新失败"));
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userService.findByUsername(username) != null;
        return ResponseEntity.ok(Map.of("exists", exists, "message", exists ? "用户名已存在" : "用户名可用"));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.findByEmail(email) != null;
        return ResponseEntity.ok(Map.of("exists", exists, "message", exists ? "邮箱已存在" : "邮箱可用"));
    }
}
