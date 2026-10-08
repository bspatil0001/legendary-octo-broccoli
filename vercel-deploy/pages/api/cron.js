// pages/api/cron.js
// Vercel Cron runs at 12:00 AM IST (18:30 UTC) daily.
// Add this to vercel.json: {"crons": [{"path": "/api/cron", "schedule": "30 18 * * *"}]}
import { readJsonStore, writeJsonStore } from '../../lib/booking-store';

export default async function handler(req, res) {
  // Verify request is from Vercel
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const control = await readJsonStore('cron-control.json', { enabled: true });
    if (!control.enabled) {
      const logs = await readJsonStore('booking-actions.json', []);
      const message = 'Scheduled booking was skipped because automatic booking cron is stopped.';
      const storage = await writeJsonStore('booking-actions.json', [
        { timestamp: new Date().toISOString(), message },
        ...logs
      ].slice(0, 100));

      return res.status(200).json({
        success: true,
        skipped: true,
        message,
        warning: storage.warning || null
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
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
