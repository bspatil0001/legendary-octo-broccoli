# 🚀 NoBroker Booking Server - Quick Start

Complete server setup with dashboard, cron scheduler, and persistent logging.

---

## **⚡ 5-Minute Setup**

### **Step 1: Install Dependencies**

```bash
cd /Users/bspatil/Documents/personal/nobroker_script
npm install
```

### **Step 2: Start Server**

```bash
npm start
```

You should see:
```
🌐 NoBroker Booking Server
✅ Server running on port 3000
📊 Dashboard: http://localhost:3000
```

### **Step 3: Open Dashboard**

Open browser to: **http://localhost:3000**

You'll see:
- ✅ Live server status
- 🎮 Control buttons (Run Now, Stop, Start)
- 📋 Real-time execution logs
- 📊 Statistics

---

## **🎮 Using the Dashboard**

### **Click "▶ RUN NOW"**
- Immediately executes booking
- Real-time status updates
- Logs appear in dashboard

### **Click "⏹ STOP CRON"**
- Disables automatic 12:00 AM execution
- Can still manually run with "Run Now"

### **Click "▶ START CRON"**
- Re-enables automatic daily execution at 12:00 AM
- Next run time updates automatically

---

## **📊 Real-Time Dashboard Shows**

| Item | Updates |
|------|---------|
| Server Status | Live (every 10s) |
| Cron Status | Running/Stopped |
| Is Running | Current execution status |
| Last Execution | Timestamp |
| Next Run Time | When cron fires |
| Total Executions | Count of all runs |
| Execution Logs | Last 15 with full output |

---

## **📝 Persistent Logging**

All executions are saved to: `executions-log.json`

Each log contains:
- ✅ Timestamp
- 📊 Status (success/error)
- 🎯 Successful slots booked
- 📄 Full execution output
- ⏱️ Duration

---

## **🌐 API Endpoints**

### **Get State**
```bash
curl http://localhost:3000/api/state
```

### **Get All Logs**
```bash
curl http://localhost:3000/api/logs
```

### **Get Recent Logs**
```bash
curl http://localhost:3000/api/logs/recent?limit=20
```

### **Execute Now**
```bash
curl -X POST http://localhost:3000/api/execute
```

### **Stop Cron**
```bash
curl -X POST http://localhost:3000/api/stop
```

### **Start Cron**
```bash
curl -X POST http://localhost:3000/api/start
```

### **Health Check**
```bash
curl http://localhost:3000/api/health
```

---

## **☁️ Deploy to Cloud (24/7 Uptime)**

### **Option 1: Railway.app (Recommended)**

```bash
# 1. Go to https://railway.app
# 2. Create account
# 3. New Project → Deploy from GitHub (or upload files)
# 4. Railway auto-runs: npm start
# 5. Get your URL: https://your-app.railway.app
```

Your cron is now:
- ✅ Running 24/7
- ✅ Independent of your computer
- ✅ Executes at 12:00 AM automatically
- ✅ Dashboard accessible from anywhere

### **Option 2: Render.com**

```bash
# Similar to Railway, go to https://render.com
# Create Web Service
# Build: npm install
# Start: npm start
```

---

## **🔧 File Structure**

```
├── server.js                 # Main server (cron + API)
├── public/
│   └── index.html           # Dashboard UI
├── booking-parallel.js      # Booking script
├── executions-log.json      # Persisted logs
├── package.json             # Dependencies
└── QUICK-START.md           # This file
```

---

## **⏰ How It Works**

1. **Server starts** → Initializes cron scheduler
2. **Dashboard opens** → Shows live status
3. **Every day at 12:00 AM** → Auto-executes booking
4. **You can click "Run Now"** → Executes immediately anytime
5. **Results logged** → Saved to `executions-log.json`
6. **Dashboard updates** → Shows results in real-time

---

## **✨ Features**

| Feature | Details |
|---------|---------|
| **Scheduling** | Cron runs at 12:00 AM daily |
| **Manual Trigger** | "Run Now" button executes instantly |
| **Live Dashboard** | Real-time updates (every 10s) |
| **Persistent Logs** | All executions saved (last 500) |
| **API Endpoints** | Control via REST API |
| **Status Display** | Live server/cron/execution status |
| **Button States** | Smart disabling based on state |
| **Cloud Ready** | Deploy anywhere (Railway, Render, etc.) |

---

## **🎯 Common Tasks**

### **Test Execution Now**
1. Open http://localhost:3000
2. Click "▶ RUN NOW"
3. Check logs for results

### **View Logs**
1. Open http://localhost:3000
2. Scroll to "Execution Logs"
3. Click "🔄 Refresh" to update

### **Check Next Run Time**
Look at "Next Run" field on dashboard

### **Stop/Start Cron**
- Click "⏹ STOP CRON" to disable
- Click "▶ START CRON" to re-enable

### **Get Data via API**
```bash
curl http://localhost:3000/api/state
curl http://localhost:3000/api/logs/latest
```

---

## **📱 Access from Anywhere**

Once deployed to cloud (Railway/Render):

1. Dashboard: `https://your-app.railway.app`
2. Logs API: `https://your-app.railway.app/api/logs`
3. Execute: `POST https://your-app.railway.app/api/execute`

---

## **🚀 Deployment (5 Steps)**

### **Railway Deployment**

```bash
# 1. Create account at https://railway.app
# 2. Create new project
# 3. Choose "Deploy from GitHub" or upload files
# 4. Select this folder
# 5. Railway deploys automatically

# Once deployed:
Dashboard: https://your-app.railway.app
API: https://your-app.railway.app/api/logs
```

---

## **❌ Troubleshooting**

### **Server won't start?**
```bash
# Check Node version
node --version  # Should be >= 14

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start again
npm start
```

### **Dashboard not loading?**
- Check server is running: `http://localhost:3000`
- Check browser console for errors
- Try different browser

### **Booking not executing?**
- Verify `booking-parallel.js` exists
- Check browser console for API errors
- Manually test: `curl -X POST http://localhost:3000/api/execute`

### **Logs not persisting?**
- Check file permissions
- Verify `executions-log.json` exists
- Check disk space

---

## **✅ You're All Set!**

Your complete booking automation is ready:
- ✅ Local dashboard running
- ✅ Cron scheduler active
- ✅ Ready to deploy to cloud
- ✅ All logs persisted
- ✅ Live button controls

**Next Step**: Deploy to Railway for 24/7 cloud execution!

---

**Questions?** Check the logs or restart the server with `npm start`.
