package com.example.eshop.service;

import com.example.eshop.entity.SysLog;
import java.util.List;
import java.util.Map;

public interface SysLogService {
    void save(SysLog sysLog);
    List<SysLog> findAll();
    List<SysLog> findByUsername(String username);
    Map<String, Object> findAllWithPagination(int page, int size);
    Map<String, Object> findAllWithFilters(int page, int size, String username, String logLevel, String search);
}