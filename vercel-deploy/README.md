# NoBroker Booking Service - Vercel Deployment

Automated facility booking service with React dashboard, cron scheduling, and persistent storage on Vercel.

## Features

✅ **Automated Bookings** - Books facilities for 6 different time slots (2 units × 3 time slots)
✅ **Cron Scheduling** - Runs daily at 12:00 AM automatically
✅ **On-Demand Execution** - "Run Now" button for manual triggering
✅ **Live Dashboard** - React UI showing status, logs, and statistics
✅ **Persistent Storage** - Uses Vercel Blob (free, built-in) for storing execution history
✅ **Parallel Execution** - All 6 bookings execute simultaneously

## Architecture

```
Pages/
  index.js           - React dashboard UI
  api/
    booking.js       - POST/GET API for bookings + KV storage
    cron.js          - Cron endpoint (triggered at 12:00 AM)
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

**Storage:** Uses Vercel Blob (built-in, no configuration needed)

## Booking Configuration

The service books the following slots:

**Unit 1** (`8a96998285aea12d0185aefccb263bcf`):
- 6:00 AM - 6:30 AM (3 days from today)
- 6:30 AM - 7:00 AM (3 days from today)
- 7:00 AM - 7:30 AM (3 days from today)

**Unit 2** (`8a96b68291b5bf710191b65d0d09543d`):
- 6:00 AM - 6:30 AM (3 days from today)
- 6:30 AM - 7:00 AM (3 days from today)
- 7:00 AM - 7:30 AM (3 days from today)

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
Logs appear on the dashboard automatically (refreshes every 10 seconds).

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
- This is automatic and free, no configuration needed

### 5. Deploy
```bash
vercel --prod
```

## Cron Scheduling

The cron job is configured in `vercel.json`:
- **Path:** `/api/cron`
- **Schedule:** `0 0 * * *` (12:00 AM UTC daily)

The cron endpoint:
1. Requires authorization via `CRON_SECRET` header
2. Calls `/api/booking` with POST method
3. Stores results in Vercel KV
4. Keeps the last 100 executions

## API Endpoints

### GET `/api/booking`
Returns all stored executions from Vercel KV.

**Response:**
```json
{
  "success": true,
  "executions": [
    {
      "timestamp": "2026-10-08T12:00:00.000Z",
      "status": "completed",
      "results": [...],
      "successful": 6,
      "total": 6
    }
  ]
}
```

### POST `/api/booking`
Executes all 6 bookings in parallel and stores results.

**Response:**
```json
{
  "success": true,
  "execution": {
    "timestamp": "2026-10-08T12:34:56.000Z",
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
    "successful": 6,
    "total": 6
  }
}
```

### POST `/api/cron`
Cron endpoint (called by Vercel scheduler).

**Headers required:**
```
Authorization: Bearer your_cron_secret_here
```

## Troubleshooting

### Logs not appearing in dashboard
1. Check browser console for errors (DevTools → F12)
2. Verify `/api/booking` GET endpoint returns data
3. Check Vercel KV database connection

### "Run Now" button not working
1. Verify `NOBROKER_TOKEN` and `NOBROKER_COOKIES` are set correctly
2. Check API response in browser Network tab
3. Verify credentials haven't expired

### Cron not running at 12:00 AM
1. Check `vercel.json` has the cron configuration
2. Verify `CRON_SECRET` environment variable is set
3. Check Vercel deployment logs for errors

### Bookings failing with API errors
1. Verify NoBroker credentials are still valid
2. Check if date is 3 days in the future (calculated from current time)
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
├── pages/
│   ├── index.js              # React dashboard
│   └── api/
│       ├── booking.js        # Booking API + KV storage
│       └── cron.js           # Cron endpoint
├── package.json              # Dependencies
├── vercel.json              # Cron configuration
├── .env.local.example       # Environment template
└── README.md                # This file
```

## License

MIT
