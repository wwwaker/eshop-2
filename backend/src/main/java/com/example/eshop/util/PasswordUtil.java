package com.example.eshop.util;

import org.mindrot.jbcrypt.BCrypt;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 密码加密工具类
 * 提供密码加密和验证功能，使用BCrypt算法
 * 兼容旧版SHA-256格式的密码验证
 */
public class PasswordUtil {

    public static String encrypt(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public static boolean matches(String rawPassword, String encodedPassword) {
        if (encodedPassword == null || encodedPassword.isEmpty()) {
            return false;
        }
        // BCrypt哈希以$2a$或$2b$开头
        if (encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$")) {
            try {
                return BCrypt.checkpw(rawPassword, encodedPassword);
            } catch (IllegalArgumentException e) {
                return false;
            }
        }
        // 兼容旧版SHA-256格式（hex和base64两种编码）
        String hex = sha256Hex(rawPassword);
        if (hex.equals(encodedPassword)) {
            return true;
        }
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(rawPassword.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            String base64 = java.util.Base64.getEncoder().encodeToString(hash);
            return base64.equals(encodedPassword);
        } catch (NoSuchAlgorithmException e) {
            return false;
        }
    }

    /**
     * 判断是否为BCrypt格式的哈希
     */
    public static boolean isBCrypt(String encodedPassword) {
        return encodedPassword != null &&
                (encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$"));
    }

    private static String sha256Hex(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
