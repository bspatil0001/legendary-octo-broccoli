# NoBroker Booking Service - Vercel Deployment

Automated facility booking service with React dashboard, cron scheduling, and persistent storage on Vercel.

## Features

✅ **Automated Bookings** - Books facilities for 8 different time slots (2 units × 4 time slots)
✅ **Cron Scheduling** - Runs daily at 12:00 AM IST
✅ **On-Demand Execution** - "Run Now" button for manual triggering
✅ **Live Dashboard** - React UI showing status, logs, and statistics
✅ **Cron Controls** - Pause or resume automatic bookings from the dashboard
✅ **Readable Activity Logs** - Displays each booking outcome and cron control action
✅ **Persistent Storage** - Uses Vercel Blob for execution history and cron state
✅ **Parallel Execution** - All 8 bookings execute simultaneously

## Architecture

```
lib/
  booking-store.js - Shared Vercel Blob/local JSON storage
pages/
  index.js           - React dashboard UI
  api/
    booking.js       - POST/GET API for bookings and execution logs
    cron.js          - Cron endpoint (triggered at 12:00 AM)
    cron-control.js  - Read and update automatic booking status
```

## Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NOBROKER_TOKEN` - Your NoBroker API access token
- `NOBROKER_COOKIES` - Your NoBroker authentication cookies
- `CRON_SECRET` - Random secret for securing cron endpoint (can be any string, e.g., `openssl rand -base64 32`)
- `NEXT_PUBLIC_API_URL` - Your deployed Vercel URL (e.g., `https://yourapp.vercel.app`)

**Storage:** Vercel Blob is recommended for persistent execution history and cron settings. Without a Blob token, or if Blob is unavailable, the app uses local storage; on Vercel this is temporary `/tmp` storage and may not persist between function instances.

## Booking Configuration

The service books the following slots:

**Unit 1** (`8a96998285aea12d0185aefccb263bcf`):
- 6:00 AM - 6:30 AM (2 days from today)
- 6:30 AM - 7:00 AM (2 days from today)
- 7:00 AM - 7:30 AM (2 days from today)
- 7:30 AM - 8:00 AM (2 days from today)

**Unit 2** (`8a96b68291b5bf710191b65d0d09543d`):
- 6:00 AM - 6:30 AM (2 days from today)
- 6:30 AM - 7:00 AM (2 days from today)
- 7:00 AM - 7:30 AM (2 days from today)
- 7:30 AM - 8:00 AM (2 days from today)

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### 3. Run development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Test on-demand execution
Click the "🚀 RUN NOW" button on the dashboard to trigger bookings manually.

### 5. View execution logs
Use **Load latest logs** in Booking History or Activity Log to fetch stored entries. Logs are loaded on initial page load and after a manual booking; the dashboard does not poll.

## Deployment to Vercel

### 1. Prepare repository
```bash
git add .
git commit -m "Add NoBroker booking service"
git push origin main
```

### 2. Create Vercel project
```bash
vercel
```

### 3. Set environment variables in Vercel
In the Vercel dashboard or via CLI:

```bash
vercel env add NOBROKER_TOKEN
vercel env add NOBROKER_COOKIES
vercel env add CRON_SECRET
vercel env add NEXT_PUBLIC_API_URL
```

### 4. Enable Vercel Blob
- Go to Vercel Dashboard → Storage → Create → Blob
- Connect the Blob store to this project so Vercel provides `BLOB_READ_WRITE_TOKEN`
- Ensure the token is available in the deployment environment, then redeploy. The API and cron continue to run without Blob, but data may be temporary.

### 5. Deploy
```bash
vercel --prod
```

## Cron Scheduling

The cron job is configured in `vercel.json`:
- **Path:** `/api/cron`
- **Schedule:** `30 18 * * *` (12:00 AM IST / 6:30 PM UTC daily)

The cron endpoint:
1. Requires authorization via `CRON_SECRET` header
2. Calls `/api/booking` with POST method
3. Checks whether automatic bookings are enabled before booking
4. Stores results and keeps the last 100 executions

Use the dashboard control to stop or restart automatic bookings. Stopping does not remove the configured Vercel Cron schedule; the route continues to be called daily, skips booking requests, and records that action. The **RUN NOW** button submits bookings immediately regardless of the automatic booking setting and displays each slot result.

## API Endpoints

### GET `/api/booking`
Returns stored booking executions and activity log entries.

**Response:**
```json
{
  "success": true,
  "executions": [
    {
      "timestamp": "2026-10-08T12:00:00.000Z",
      "status": "completed",
      "results": [...],
      "successful": 8,
      "total": 8
    }
  ]
}
```

### POST `/api/booking`
Executes all 8 bookings in parallel and stores a human-readable summary and per-slot result. The optional `trigger` field may be set to `"scheduled"`; otherwise the run is recorded as on-demand.

**Response:**
```json
{
  "success": true,
  "execution": {
    "timestamp": "2026-10-08T12:34:56.000Z",
    "trigger": "manual",
    "bookingDate": "10/10/2026",
    "summary": "On-demand booking run finished: 8 of 8 bookings succeeded.",
    "status": "completed",
    "results": [
      {
        "id": "curl1",
        "name": "Unit 1 - 6:00 AM - 6:30 AM",
        "status": 200,
        "statusText": "OK",
        "apiStatus": 1,
        "message": "Booking successful",
        "booked": true
      },
      ...
    ],
    "successful": 8,
    "total": 8
  }
}
```

### POST `/api/cron`
Cron endpoint (called by Vercel scheduler).

**Headers required:**
```
Authorization: Bearer your_cron_secret_here
```

### GET `/api/cron-control`
Returns whether automatic bookings are enabled and recent activity log entries.

### POST `/api/cron-control`
Sets the automatic booking state. Send `{"enabled": false}` to pause scheduled bookings or `{"enabled": true}` to resume them. Each change is recorded in the activity log.

## Troubleshooting

### Logs not appearing in dashboard
1. Check browser console for errors (DevTools → F12)
2. Verify `/api/booking` GET endpoint returns data
3. Check Vercel Blob configuration and any storage warning returned by the API

### "Run Now" button not working
1. Verify `NOBROKER_TOKEN` and `NOBROKER_COOKIES` are set correctly
2. Check API response in browser Network tab
3. Verify credentials haven't expired
4. If logs or cron settings are not persisting, connect a Blob store to the project and redeploy

### Cron not running at 12:00 AM IST
1. Check `vercel.json` has the cron configuration
2. Verify `CRON_SECRET` environment variable is set
3. Check Vercel deployment logs for errors

### Bookings failing with API errors
1. Verify NoBroker credentials are still valid
2. Check if the booking date is 2 days in the future
3. Ensure time slots are not already booked
4. Verify unitId and apartmentId IDs are correct

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
vercel-deploy/
├── lib/
│   └── booking-store.js     # Shared Blob/local JSON storage
├── pages/
│   ├── index.js              # React dashboard
│   └── api/
│       ├── booking.js        # Booking API + execution logs
│       ├── cron.js           # Cron endpoint
│       └── cron-control.js   # Start/stop automatic bookings
├── package.json              # Dependencies
├── vercel.json              # Cron configuration
├── .env.local.example       # Environment template
└── README.md                # This file
```

## License

MIT
