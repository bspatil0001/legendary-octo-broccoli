// pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState({ total: 0, successful: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExecutions();
    const interval = setInterval(loadExecutions, 10000);
    return () => clearInterval(interval);
  }, []);

  async function loadExecutions() {
    try {
      const response = await fetch('/api/booking');
      const data = await response.json();

      if (data.success) {
        setExecutions(data.executions.reverse());
        calculateStats(data.executions);
      }
    } catch (error) {
      console.error('Error loading executions:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(execs) {
    const totalBookings = execs.reduce((sum, e) => sum + e.results.length, 0);
    const successfulBookings = execs.reduce((sum, e) => sum + e.successful, 0);
    setStats({ total: totalBookings, successful: successfulBookings });
  }

  async function handleRunNow() {
    setIsRunning(true);
    try {
      const response = await fetch('/api/booking', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        await loadExecutions();
        alert('✅ Booking executed successfully!');
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div style={styles.container}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
      `}</style>

      <div style={styles.header}>
        <h1>🚀 NoBroker Booking Service</h1>
        <p>Automated facility booking with live dashboard</p>
      </div>

      <div style={styles.content}>
        {/* Status Cards */}
        <div style={styles.statusGrid}>
          <div style={styles.card}>
            <div style={styles.statusRow}>
              <span style={styles.label}>Status</span>
              <span style={styles.badge}>
                <span style={styles.dot}></span>
                Running
              </span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.label}>Total Executions</span>
              <span style={styles.value}>{executions.length}</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.label}>Cron Schedule</span>
              <span style={styles.value}>12:00 AM Daily</span>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.statusRow}>
              <span style={styles.label}>Total Bookings</span>
              <span style={styles.value}>{stats.total}</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.label}>Successful</span>
              <span style={{ ...styles.value, color: '#28a745' }}>{stats.successful}</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.label}>Failed</span>
              <span style={{ ...styles.value, color: '#dc3545' }}>{stats.total - stats.successful}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button
            onClick={handleRunNow}
            disabled={isRunning}
            style={isRunning ? { ...styles.button, opacity: 0.5 } : styles.button}
          >
            {isRunning ? '⏳ Running...' : '🚀 RUN NOW'}
          </button>
        </div>

        {/* Execution Logs */}
        <div style={styles.logs}>
          <h2>📋 Execution Logs</h2>
          {loading ? (
            <div style={styles.empty}>Loading logs...</div>
          ) : executions.length === 0 ? (
            <div style={styles.empty}>No executions yet. Click "RUN NOW" to test!</div>
          ) : (
            executions.slice(0, 10).map((execution, idx) => (
              <div key={idx} style={styles.logEntry}>
                <div style={styles.logTime}>
                  📅 {new Date(execution.timestamp).toLocaleString()}
                </div>
                <div style={styles.logStatus}>
                  ✅ {execution.successful}/{execution.total} bookings successful
                </div>
                <div style={styles.logResults}>
                  {execution.results.map((result, ridx) => (
                    <div key={ridx} style={styles.resultItem}>
                      <span>{result.booked ? '✅' : '❌'}</span> {result.name}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.footer}>
        <p>✅ Logs stored in Vercel KV | ⏰ Runs daily at 12:00 AM</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  header: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '0 auto 24px'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee'
  },
  label: {
    color: '#666',
    fontSize: '14px',
    fontWeight: 500
  },
  value: {
    color: '#333',
    fontSize: '16px',
    fontWeight: 600
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: '#d4edda',
    color: '#155724',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#28a745',
    animation: 'pulse 2s infinite'
  },
  controls: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
  },
  button: {
    width: '100%',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  logs: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '32px'
  },
  logEntry: {
    background: '#f8f9fa',
    borderLeft: '4px solid #667eea',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px'
  },
  logTime: {
    color: '#999',
    fontSize: '11px',
    marginBottom: '4px'
  },
  logStatus: {
    color: '#333',
    fontWeight: 600,
    marginBottom: '8px'
  },
  logResults: {
    color: '#555'
  },
  resultItem: {
    margin: '4px 0',
    paddingLeft: '16px'
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: '12px',
    marginTop: '24px'
  }
};
