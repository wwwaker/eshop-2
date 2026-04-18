package com.example.eshop.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * 密码加密工具类
 * 提供密码加密和验证功能，使用SHA-256算法
 */
public class PasswordUtil {

    public static String encrypt(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
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

    public static boolean matches(String rawPassword, String encodedPassword) {
        if (encrypt(rawPassword).equals(encodedPassword)) {
            return true;
        }

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(rawPassword.getBytes());
            String base64Password = Base64.getEncoder().encodeToString(hash);
            return base64Password.equals(encodedPassword);
        } catch (NoSuchAlgorithmException e) {
            return false;
        }
    }
}
