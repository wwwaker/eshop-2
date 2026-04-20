import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { typography, tables, layout, alerts } from '../styles';

interface SysLog {
  id: number;
  logLevel: string;
  logContent: string;
  createTime: string;
  className: string;
  methodName: string;
  requestUrl: string;
  username: string;
  ip: string;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SysLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/logs');
      // 按创建时间倒序排序
      const sortedLogs = response.data.sort((a: SysLog, b: SysLog) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      });
      setLogs(sortedLogs);
      setError('');
    } catch (err: any) {
      setError('获取系统日志失败');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={typography.h1}>系统日志</h1>

      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>
      ) : (
        <div style={layout.overflowX.auto}>
          <table style={tables.default}>
            <thead>
              <tr style={tables.header}>
                <th style={tables.headerCell}>ID</th>
                <th style={tables.headerCell}>用户名</th>
                <th style={tables.headerCell}>日志级别</th>
                <th style={tables.headerCell}>日志内容</th>
                <th style={tables.headerCell}>请求URL</th>
                <th style={tables.headerCell}>IP地址</th>
                <th style={tables.headerCell}>类名</th>
                <th style={tables.headerCell}>方法名</th>
                <th style={tables.headerCell}>操作时间</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={tables.row}>
                  <td style={tables.cell}>{log.id}</td>
                  <td style={tables.cell}>{log.username}</td>
                  <td style={tables.cell}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: log.logLevel === 'ERROR' ? '#f8d7da' : '#d4edda',
                      color: log.logLevel === 'ERROR' ? '#721c24' : '#155724'
                    }}>
                      {log.logLevel}
                    </span>
                  </td>
                  <td style={tables.cell}>{log.logContent}</td>
                  <td style={tables.cell}>{log.requestUrl}</td>
                  <td style={tables.cell}>{log.ip}</td>
                  <td style={tables.cell}>{log.className}</td>
                  <td style={tables.cell}>{log.methodName}</td>
                  <td style={tables.cell}>
                    {new Date(log.createTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogsPage;