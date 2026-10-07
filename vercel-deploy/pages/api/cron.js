// pages/api/cron.js
// Vercel Cron job: runs at 12:00 AM daily
// Add this to vercel.json: {"crons": [{"path": "/api/cron", "schedule": "0 0 * * *"}]}

export default async function handler(req, res) {
  // Verify request is from Vercel
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Trigger the booking API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

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
