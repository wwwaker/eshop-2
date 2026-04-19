package com.example.eshop.service;

import com.example.eshop.entity.SysLog;
import java.util.List;

public interface SysLogService {
    void save(SysLog sysLog);
    List<SysLog> findAll();
    List<SysLog> findByUsername(String username);
}