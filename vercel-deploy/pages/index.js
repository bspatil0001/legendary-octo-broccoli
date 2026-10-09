// pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [executions, setExecutions] = useState([]);
  const [actionLogs, setActionLogs] = useState([]);
  const [cronEnabled, setCronEnabled] = useState(true);
  const [stats, setStats] = useState({ total: 0, successful: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingCron, setIsUpdatingCron] = useState(false);
  const [latestRun, setLatestRun] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard(manualRefresh = false) {
    if (manualRefresh) {
      setIsRefreshing(true);
    }
    try {
      const [bookingResponse, cronResponse] = await Promise.all([
        fetch('/api/booking'),
        fetch('/api/cron-control')
      ]);
      const [data, cronData] = await Promise.all([
        bookingResponse.json(),
        cronResponse.json()
      ]);

      if (!bookingResponse.ok || !data.success) {
        throw new Error(data.error || 'Unable to load booking logs.');
      }
      if (!cronResponse.ok || !cronData.success) {
        throw new Error(cronData.error || 'Unable to load cron status.');
      }

      setExecutions(data.executions);
      setActionLogs(data.actionLogs || cronData.actionLogs || []);
      setCronEnabled(cronData.enabled);
      calculateStats(data.executions);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(`Dashboard update failed: ${error.message}`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  function calculateStats(execs) {
    const totalBookings = execs.reduce((sum, execution) => sum + (execution.results?.length || 0), 0);
    const successfulBookings = execs.reduce((sum, execution) => sum + (execution.successful || 0), 0);
    setStats({ total: totalBookings, successful: successfulBookings });
  }

  async function handleRunNow() {
    setIsRunning(true);
    setFeedback('');
    setErrorMessage('');
    try {
      const response = await fetch('/api/booking', { method: 'POST' });
      const data = await response.json();

      if (data.execution) {
        setLatestRun(data.execution);
      }
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'The booking request failed.');
      }

      setFeedback(`${data.execution.summary}${data.warning ? ` ${data.warning}` : ''}`);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(`Run Now failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  }

  async function handleCronToggle(enabled) {
    setIsUpdatingCron(true);
    setFeedback('');
    setErrorMessage('');
    try {
      const response = await fetch('/api/cron-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to update cron status.');
      }

      setCronEnabled(data.enabled);
      setFeedback(`${data.message}${data.warning ? ` ${data.warning}` : ''}`);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(`Cron update failed: ${error.message}`);
    } finally {
      setIsUpdatingCron(false);
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
              <span style={cronEnabled ? styles.badge : styles.pausedBadge}>
                <span style={{ ...styles.dot, background: cronEnabled ? '#28a745' : '#dc3545' }}></span>
                {cronEnabled ? 'Automatic bookings active' : 'Automatic bookings stopped'}
              </span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.label}>Total Executions</span>
              <span style={styles.value}>{executions.length}</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.label}>Cron Schedule</span>
              <span style={styles.value}>11:05 AM IST daily</span>
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
          <button
            onClick={() => handleCronToggle(!cronEnabled)}
            disabled={isUpdatingCron}
            style={cronEnabled ? styles.stopButton : styles.startButton}
          >
            {isUpdatingCron ? 'Updating...' : cronEnabled ? 'Stop automatic bookings' : 'Start automatic bookings'}
          </button>
          <p style={styles.controlHint}>
            Stopping pauses scheduled bookings; the daily Vercel cron trigger remains configured.
          </p>
          {feedback && <p role="status" style={styles.feedback}>{feedback}</p>}
          {errorMessage && <p role="alert" style={styles.error}>{errorMessage}</p>}
        </div>

        {latestRun && (
          <div style={styles.latestRun}>
            <h2>Latest Run Now Result</h2>
            <p style={styles.logStatus}>{latestRun.summary}</p>
            <div style={styles.logResults}>
              {latestRun.results.map(result => (
                <div key={result.id} style={styles.resultItem}>
                  <span>{result.booked ? '✅' : '❌'}</span> {result.name}: {result.message || result.error || 'No response message'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execution Logs */}
        <div style={styles.logs}>
          <div style={styles.logHeader}>
            <h2>📋 Booking History</h2>
            <button
              onClick={() => loadDashboard(true)}
              disabled={isRefreshing || loading}
              style={styles.refreshButton}
            >
              {isRefreshing ? 'Loading logs...' : 'Load latest logs'}
            </button>
          </div>
          {loading ? (
            <div style={styles.empty}>Loading logs...</div>
          ) : executions.length === 0 ? (
            <div style={styles.empty}>No executions yet. Click "RUN NOW" to test!</div>
          ) : (
            executions.slice(0, 10).map(execution => (
              <div key={execution.timestamp} style={styles.logEntry}>
                <div style={styles.logTime}>
                  📅 {new Date(execution.timestamp).toLocaleString()}
                </div>
                <div style={styles.logStatus}>
                  {execution.summary || `${execution.successful}/${execution.total} bookings succeeded.`}
                </div>
                <div style={styles.logTime}>
                  {execution.trigger === 'scheduled' ? 'Scheduled run' : execution.trigger === 'manual' ? 'On-demand run' : 'Booking run'}
                  {execution.bookingDate ? ` · Booking date: ${execution.bookingDate}` : ''}
                </div>
                <div style={styles.logResults}>
                  {execution.results.map(result => (
                    <div key={result.id} style={styles.resultItem}>
                      <span>{result.booked ? '✅' : '❌'}</span> {result.name}: {result.message || result.error || 'No response message'}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.logs}>
          <div style={styles.logHeader}>
            <h2>📝 Activity Log</h2>
            <button
              onClick={() => loadDashboard(true)}
              disabled={isRefreshing || loading}
              style={styles.refreshButton}
            >
              {isRefreshing ? 'Loading logs...' : 'Load latest logs'}
            </button>
          </div>
          {actionLogs.length === 0 ? (
            <div style={styles.empty}>No cron control actions recorded yet.</div>
          ) : (
            actionLogs.slice(0, 10).map((log, idx) => (
              <div key={`${log.timestamp}-${idx}`} style={styles.activityItem}>
                <span style={styles.logTime}>{new Date(log.timestamp).toLocaleString()}</span>
                <span>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.footer}>
        <p>Execution and activity logs are stored with the configured storage backend | ⏰ Scheduled daily at 11:05 AM IST</p>
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
  stopButton: {
    width: '100%',
    padding: '12px 24px',
    marginTop: '12px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  startButton: {
    width: '100%',
    padding: '12px 24px',
    marginTop: '12px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  controlHint: {
    color: '#666',
    fontSize: '12px',
    marginTop: '10px',
    textAlign: 'center'
  },
  feedback: {
    color: '#155724',
    background: '#d4edda',
    padding: '10px',
    borderRadius: '6px',
    marginTop: '12px'
  },
  error: {
    color: '#721c24',
    background: '#f8d7da',
    padding: '10px',
    borderRadius: '6px',
    marginTop: '12px'
  },
  latestRun: {
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
    marginBottom: '24px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  refreshButton: {
    padding: '8px 12px',
    background: '#eef2ff',
    color: '#4338ca',
    border: '1px solid #c7d2fe',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  activityItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    background: '#f8f9fa',
    borderLeft: '4px solid #6c757d',
    padding: '12px',
    marginTop: '10px',
    borderRadius: '4px',
    color: '#333',
    fontSize: '13px'
  },
  pausedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: '#f8d7da',
    color: '#721c24',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600
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
