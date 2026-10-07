# NoBroker Booking Cron Server - Deployment Guide

This is a **standalone production-ready cron server** that runs automatically every day at 12:00 AM.

## Features

✅ Runs independently (no local system dependency)  
✅ Executes booking automatically at 12:00 AM daily  
✅ Logs all executions  
✅ Monitoring endpoints  
✅ Manual trigger for testing  
✅ Cloud-ready (deploy anywhere)

---

## Quick Start (Local Testing)

```bash
cd /Users/bspatil/Documents/personal/nobroker_script

# Install dependencies
npm install

# Start server
npm start
```

Server will start at `http://localhost:3000`

### Test Manual Execution

```bash
curl -X POST http://localhost:3000/execute
```

### View Logs

```bash
curl http://localhost:3000/logs
```

---

## Deployment Options

### Option 1: **Railway.app** (Recommended - Free tier)

1. **Create account** at https://railway.app
2. **Connect GitHub** repo or upload files
3. **Deploy**:
   ```bash
   # Railway will automatically:
   - Install dependencies (npm install)
   - Run: npm start
   - Keep server running 24/7
   ```
4. **Get public URL** - Your cron runs on Railway's servers

**Cost**: Free tier includes enough for this use case

---

### Option 2: **Render.com** (Free tier)

1. Go to https://render.com
2. Create new **Web Service**
3. **Build command**: `npm install`
4. **Start command**: `npm start`
5. Deploy and get URL

**Cost**: Free with limitations

---

### Option 3: **Heroku** (Requires paid plan now)

```bash
heroku login
heroku create your-app-name
git push heroku main
```

---

### Option 4: **AWS Lambda** + **CloudWatch**

1. Package code as Lambda function
2. Trigger with CloudWatch Events at 12:00 AM
3. Runs on AWS infrastructure

---

### Option 5: **DigitalOcean App Platform** (Paid)

Simple deployment from GitHub

---

## Architecture

```
┌─────────────────────────────────────┐
│   Your Cloud Server (Railway/Render)|
│  ┌────────────────────────────────┐ │
│  │  Cron Server (cron-server.js)  │ │
│  │  ✅ Runs 24/7                  │ │
│  │  ✅ Auto-executes at 12:00 AM  │ │
│  │  ✅ No local dependency        │ │
│  └────────────────────────────────┘ │
│              ↓                       │
│  ┌────────────────────────────────┐ │
│  │  booking-parallel.js           │ │
│  │  (executes booking)            │ │
│  └────────────────────────────────┘ │
│              ↓                       │
│  ┌────────────────────────────────┐ │
│  │  cron-logs.json                │ │
│  │  (stores all executions)       │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
          (Independent of your computer)
```

---

## Monitoring

Once deployed, access:

- **Health Check**: `https://your-app.railway.app/health`
- **View Logs**: `https://your-app.railway.app/logs`
- **Latest Execution**: `https://your-app.railway.app/logs/latest`
- **Manual Trigger**: `POST https://your-app.railway.app/execute`

---

## Configuration

### Environment Variables

Set these on your server:

```
PORT=3000                    # Server port
LOG_FILE=/app/cron-logs.json # Log storage location
```

---

## Files Included

```
├── cron-server.js          # Main cron server
├── booking-parallel.js     # Booking script
├── package.json            # Dependencies
├── DEPLOYMENT.md           # This file
├── run-booking.sh          # Shell wrapper (if using local)
└── cron-logs.json          # Execution logs (created on first run)
```

---

## How It Works

1. **Server starts** → Initializes cron scheduler
2. **Every day at 12:00 AM** → Automatically runs booking
3. **Booking executes** → Calls `booking-parallel.js`
4. **Results logged** → Saved to `cron-logs.json`
5. **Dashboard updated** → Logs available via API

---

## Troubleshooting

### Booking not executing?
- Check server logs on platform dashboard
- Manually trigger: `POST /execute`
- Verify `booking-parallel.js` has valid credentials

### Logs not saving?
- Check write permissions for log file
- Verify `LOG_FILE` path is correct
- Check available disk space

### Server not starting?
- Run: `npm install` first
- Check Node version >= 14
- Verify `booking-parallel.js` exists

---

## Next Steps

1. **Choose a platform** (Railway recommended for ease)
2. **Deploy this folder** to your chosen platform
3. **Get your server URL** from platform dashboard
4. **Update dashboard** to point to your server logs endpoint
5. **Monitor logs** via API or platform dashboard

---

## Security Notes

- Keep credentials in `booking-parallel.js` secure
- Don't commit credentials to Git
- Use environment variables for sensitive data
- Consider adding API authentication if deployed publicly

---

## Support

For issues:
1. Check server logs on platform dashboard
2. Manually test with `/execute` endpoint
3. Verify `booking-parallel.js` runs locally first
4. Check error logs in `cron-logs.json`
