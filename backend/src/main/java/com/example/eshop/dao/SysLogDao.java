package com.example.eshop.dao;

import com.example.eshop.entity.SysLog;
import java.util.List;

public interface SysLogDao {
    int insert(SysLog sysLog);
    List<SysLog> findAll();
    List<SysLog> findByUsername(String username);
    List<SysLog> findAllWithPagination(int offset, int size);
    List<SysLog> findWithFilters(int offset, int size, String username, String logLevel, String search);
    int countAll();
    int countWithFilters(String username, String logLevel, String search);
}