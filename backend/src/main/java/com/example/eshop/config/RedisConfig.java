package com.example.eshop.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis缓存配置类
 * 配置RedisTemplate序列化方式及Spring Cache缓存管理器的TTL策略
 */
@Configuration
@EnableCaching
public class RedisConfig {

    /**
     * 构建支持JavaTimeModule的ObjectMapper，用于Redis序列化
     */
    private ObjectMapper buildObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );
        return objectMapper;
    }

    /**
     * 自定义RedisTemplate，使用Jackson2Json序列化
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(buildObjectMapper());
        StringRedisSerializer stringSerializer = StringRedisSerializer.UTF_8;

        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }

    /**
     * 配置Spring Cache的缓存管理器，为不同缓存区设置不同TTL
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(buildObjectMapper());

        // 默认缓存配置：30分钟过期
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(StringRedisSerializer.UTF_8))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer))
                .disableCachingNullValues();

        // 各缓存区的TTL策略
        Map<String, RedisCacheConfiguration> configMap = new HashMap<>();

        // 商品缓存：热门数据，10分钟
        configMap.put(CacheConst.PRODUCTS, defaultConfig.entryTtl(Duration.ofMinutes(10)));

        // 分类缓存：很少变更，60分钟
        configMap.put(CacheConst.CATEGORIES, defaultConfig.entryTtl(Duration.ofMinutes(60)));

        // 用户缓存：30分钟
        configMap.put(CacheConst.USERS, defaultConfig.entryTtl(Duration.ofMinutes(30)));

        return RedisCacheManager.builder(factory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(configMap)
                .build();
    }
}