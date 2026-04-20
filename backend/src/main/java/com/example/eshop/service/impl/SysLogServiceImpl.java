package com.example.eshop.service.impl;

import com.example.eshop.dao.SysLogDao;
import com.example.eshop.entity.SysLog;
import com.example.eshop.service.SysLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SysLogServiceImpl implements SysLogService {

    private final SysLogDao sysLogDao;

    @Autowired
    public SysLogServiceImpl(SysLogDao sysLogDao) {
        this.sysLogDao = sysLogDao;
    }

    @Override
    public void save(SysLog sysLog) {
        sysLogDao.insert(sysLog);
    }

    @Override
    public List<SysLog> findAll() {
        return sysLogDao.findAll();
    }

    @Override
    public List<SysLog> findByUsername(String username) {
        return sysLogDao.findByUsername(username);
    }

    @Override
    public Map<String, Object> findAllWithPagination(int page, int size) {
        int offset = (page - 1) * size;
        List<SysLog> logs = sysLogDao.findAllWithPagination(offset, size);
        int totalElements = sysLogDao.countAll();
        int totalPages = (totalElements + size - 1) / size;
        
        Map<String, Object> result = new HashMap<>();
        result.put("content", logs);
        result.put("totalElements", totalElements);
        result.put("totalPages", totalPages);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
}