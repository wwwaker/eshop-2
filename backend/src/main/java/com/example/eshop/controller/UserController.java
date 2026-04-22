package com.example.eshop.controller;

import com.example.eshop.entity.User;
import com.example.eshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.imageio.ImageIO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.Random;

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

    /**
     * 生成验证码
     * @return 包含验证码图片的响应
     * @throws IOException 图片生成异常
     */
    @GetMapping("/captcha")
    public ResponseEntity<?> getCaptcha() throws IOException {
        // 获取当前请求的HttpServletRequest
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        // 生成验证码文本
        String captchaText = generateCaptchaText();
        // 存储验证码到session
        HttpSession session = request.getSession();
        session.setAttribute("captcha", captchaText);
        // 生成验证码图片
        BufferedImage image = generateCaptchaImage(captchaText);
        // 将图片转换为base64
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", outputStream);
        byte[] imageBytes = outputStream.toByteArray();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        
        return ResponseEntity.ok(Map.of("captcha", base64Image));
    }

    /**
     * 生成验证码文本
     * @return 验证码文本
     */
    private String generateCaptchaText() {
        String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 4; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    /**
     * 生成验证码图片
     * @param captchaText 验证码文本
     * @return 验证码图片
     */
    private BufferedImage generateCaptchaImage(String captchaText) {
        int width = 120;
        int height = 40;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        
        // 设置背景色
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);
        
        // 设置边框
        g.setColor(Color.GRAY);
        g.setStroke(new BasicStroke(1));
        g.drawRect(0, 0, width - 1, height - 1);
        
        // 生成干扰线
        Random random = new Random();
        for (int i = 0; i < 8; i++) {
            g.setColor(new Color(random.nextInt(255), random.nextInt(255), random.nextInt(255)));
            g.setStroke(new BasicStroke(1.5f));
            int x1 = random.nextInt(width);
            int y1 = random.nextInt(height);
            int x2 = random.nextInt(width);
            int y2 = random.nextInt(height);
            g.drawLine(x1, y1, x2, y2);
        }
        
        // 生成干扰点
        for (int i = 0; i < 50; i++) {
            g.setColor(new Color(random.nextInt(255), random.nextInt(255), random.nextInt(255)));
            int x = random.nextInt(width);
            int y = random.nextInt(height);
            g.fillOval(x, y, 2, 2);
        }
        
        // 绘制验证码文本
        g.setFont(new Font("Arial", Font.BOLD, 20));
        for (int i = 0; i < captchaText.length(); i++) {
            g.setColor(new Color(random.nextInt(100), random.nextInt(100), random.nextInt(100)));
            // 随机旋转角度
            double angle = (random.nextDouble() - 0.5) * Math.PI / 4;
            g.rotate(angle, 20 + i * 25, 25);
            g.drawString(String.valueOf(captchaText.charAt(i)), 20 + i * 25, 25);
            g.rotate(-angle, 20 + i * 25, 25);
        }
        
        g.dispose();
        return image;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        String captcha = loginData.get("captcha");
        
        // 获取当前请求的HttpServletRequest
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        // 验证验证码
        HttpSession session = request.getSession();
        String sessionCaptcha = (String) session.getAttribute("captcha");
        if (sessionCaptcha == null || !sessionCaptcha.equalsIgnoreCase(captcha)) {
            return ResponseEntity.badRequest().body(Map.of("error", "验证码错误"));
        }
        // 验证成功后清除验证码，防止重复使用
        session.removeAttribute("captcha");
        
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
