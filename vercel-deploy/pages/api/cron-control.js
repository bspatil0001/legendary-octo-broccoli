import { readJsonStore, writeJsonStore } from '../../lib/booking-store';

const CONTROL_KEY = 'cron-control.json';
const ACTION_LOGS_KEY = 'booking-actions.json';

async function logAction(message) {
  const logs = await readJsonStore(ACTION_LOGS_KEY, []);
  const updatedLogs = [
    {
      timestamp: new Date().toISOString(),
      message
    },
    ...logs
  ].slice(0, 100);

  return writeJsonStore(ACTION_LOGS_KEY, updatedLogs);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const control = await readJsonStore(CONTROL_KEY, { enabled: true });
      const actionLogs = await readJsonStore(ACTION_LOGS_KEY, []);

      return res.status(200).json({
        success: true,
        enabled: control.enabled,
        actionLogs
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    if (typeof req.body?.enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'The enabled field must be a boolean.'
      });
    }

    try {
      const enabled = req.body.enabled;
      const message = enabled
        ? 'Automatic booking cron was started.'
        : 'Automatic booking cron was stopped.';
      const storage = await writeJsonStore(CONTROL_KEY, {
        enabled,
        updatedAt: new Date().toISOString()
      });
      const logStorage = await logAction(message);

      return res.status(200).json({
        success: true,
        enabled,
        message,
        warning: storage.warning || logStorage.warning || null
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
