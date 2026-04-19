import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      <h1>系统日志</h1>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>用户名</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>日志级别</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>日志内容</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>请求URL</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>IP地址</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>类名</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>方法名</th>
                <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>操作时间</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{log.id}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{log.username}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
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
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{log.logContent}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{log.requestUrl}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{log.ip}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{log.className}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{log.methodName}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
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