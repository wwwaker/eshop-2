import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const totalPages = Math.ceil(totalElements / pageSize);

  useEffect(() => {
    fetchLogs(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchLogs = async (page: number, size: number) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/logs', {
        params: { page, size }
      });
      const data = response.data;
      if (Array.isArray(data)) {
        const sortedLogs = data.sort((a: SysLog, b: SysLog) => {
          return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
        });
        setLogs(sortedLogs);
        setTotalElements(data.length);
      } else if (data.content && Array.isArray(data.content)) {
        setLogs(data.content);
        setTotalElements(data.totalElements || data.content.length);
      }
      setError('');
    } catch (err: any) {
      setError('获取系统日志失败');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={typography.h1}>系统日志</h1>

      {error && (
        <div style={alerts.error}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>
      ) : (
        <>
          <div style={layout.overflowX.auto}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '13px',
              lineHeight: '1.4'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f5f5f5',
                  borderBottom: '1px solid #ddd'
                }}>
                  <th style={{ 
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '12px',
                    width: '50px'
                  }}>ID</th>
                  <th style={{ 
                    padding: '8px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '12px',
                    width: '80px'
                  }}>用户</th>
                  <th style={{ 
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '12px',
                    width: '80px'
                  }}>级别</th>
                  <th style={{ 
                    padding: '8px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '12px',
                    minWidth: '180px'
                  }}>内容</th>
                  <th style={{ 
                    padding: '8px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '12px',
                    width: '150px'
                  }}>URL</th>
                  <th style={{ 
                    padding: '8px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '12px',
                    width: '120px'
                  }}>方法</th>
                  <th style={{ 
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '12px',
                    width: '120px'
                  }}>时间</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <td style={{ 
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'top',
                      fontSize: '12px'
                    }}>{log.id}</td>
                    <td style={{ 
                      padding: '6px 8px',
                      textAlign: 'left',
                      verticalAlign: 'top',
                      fontSize: '12px'
                    }}>{log.username}</td>
                    <td style={{ 
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'top'
                    }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: '600',
                        backgroundColor: log.logLevel === 'ERROR' ? '#ffebee' : '#e8f5e8',
                        color: log.logLevel === 'ERROR' ? '#c62828' : '#2e7d32'
                      }}>
                        {log.logLevel}
                      </span>
                    </td>
                    <td style={{
                      padding: '6px 8px',
                      textAlign: 'left',
                      verticalAlign: 'top',
                      lineHeight: '1.3',
                      whiteSpace: 'normal',
                      fontSize: '12px'
                    }}>{log.logContent}</td>
                    <td style={{
                      padding: '6px 8px',
                      textAlign: 'left',
                      verticalAlign: 'top',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '12px'
                    }}>
                      <span title={log.requestUrl}>{log.requestUrl}</span>
                    </td>
                    <td style={{
                      padding: '6px 8px',
                      textAlign: 'left',
                      verticalAlign: 'top',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '12px'
                    }}>
                      <span title={`${log.className}.${log.methodName}`}>{log.methodName}</span>
                    </td>
                    <td style={{ 
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'top',
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      {new Date(log.createTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LogsPage;