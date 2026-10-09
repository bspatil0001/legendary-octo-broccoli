// pages/api/cron.js
// Vercel Cron runs at 11:05 AM IST (05:35 UTC) daily.
// Add this to vercel.json: {"crons": [{"path": "/api/cron", "schedule": "35 5 * * *"}]}
import { readJsonStore, writeJsonStore } from '../../lib/booking-store';

export default async function handler(req, res) {
  // Verify request is from Vercel
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let control = { enabled: true };
    let warning = null;
    try {
      control = await readJsonStore('cron-control.json', control);
    } catch (error) {
      warning = `Could not read cron settings; proceeding with cron enabled: ${error.message}`;
    }

    if (!control.enabled) {
      const message = 'Scheduled booking was skipped because automatic booking cron is stopped.';
      try {
        const logs = await readJsonStore('booking-actions.json', []);
        const storage = await writeJsonStore('booking-actions.json', [
          { timestamp: new Date().toISOString(), message },
          ...logs
        ].slice(0, 100));
        warning = [warning, storage.warning].filter(Boolean).join(' ') || null;
      } catch (error) {
        warning = [warning, `Could not save cron activity: ${error.message}`].filter(Boolean).join(' ');
      }

      return res.status(200).json({
        success: true,
        skipped: true,
        message,
        warning
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `https://${req.headers.host}`;
    const response = await fetch(`${baseUrl}/api/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trigger: 'scheduled' })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Scheduled booking request failed.',
        data
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cron execution completed',
      data,
      warning
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
