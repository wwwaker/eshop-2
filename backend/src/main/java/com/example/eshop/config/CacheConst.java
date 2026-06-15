package com.example.eshop.config;

/**
 * 缓存常量类
 * 定义Spring Cache注解中使用的缓存名称，统一管理避免拼写错误
 */
public final class CacheConst {

    private CacheConst() {
    }

    /** 商品缓存区 */
    public static final String PRODUCTS = "products";

    /** 分类缓存区 */
    public static final String CATEGORIES = "categories";

    /** 用户缓存区 */
    public static final String USERS = "users";
}