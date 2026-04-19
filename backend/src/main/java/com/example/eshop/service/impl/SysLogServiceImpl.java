package com.example.eshop.service.impl;

import com.example.eshop.dao.SysLogDao;
import com.example.eshop.entity.SysLog;
import com.example.eshop.service.SysLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}