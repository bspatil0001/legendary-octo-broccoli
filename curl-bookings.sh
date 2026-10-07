#!/bin/bash

# NoBroker Booking - 6 Different Curl Commands
# Run individually: bash curl-bookings.sh
# Or run specific curl: curl -X POST ... (copy from below)

API_URL="https://www.nobrokerhood.com/booking/secured/v2/resident/new"
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU9yRW1haWwiOiI5NjExMTU2MTYxIiwiZXhwIjoxODA3MDM2MjAwLCJ1c2VySWQiOiI4YTk2Yzg4MjhjMzc4YjcxMDE4YzM3ZDdmMDYyNTE3YyIsImRldmljZUlkIjoiYmI1MWZlOGY5OTViNDZjZGYyNzIxMTA1MDcxY2ZmMGEiLCJpYXQiOjE3OTEzODYxMzh9.ifdnhVYQSAcLWQPviedZsgV_6iOHyKLMsueCYWWFP9E"
COOKIES="remember-me=ZkxIM3UwSGQ0Q2NSVUlQSzdLRU12dyUzRCUzRDoxeThsJTJGTXdGZ3IxYyUyRktrcWVDTjZDUSUzRCUzRA; JSESSIONID=MjJhNmMwMWEtNmQyNy00NmUwLTg3OGYtYTExZjY0NjNiMzQ5"

echo "🚀 NoBroker Booking - 6 Different Curl Commands"
echo "=================================================="
echo ""

# ============================================================
# CURL 1: Unit 1 - 6:00 AM - 6:30 AM
# ============================================================
echo "1️⃣  CURL 1: Unit 1 - 6:00 AM - 6:30 AM Slot"
echo "Command:"
echo ""
cat << 'EOF'
curl -X POST "https://www.nobrokerhood.com/booking/secured/v2/resident/new" \
  -H "access-token: eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU9yRW1haWwiOiI5NjExMTU2MTYxIiwiZXhwIjoxODA3MDM2MjAwLCJ1c2VySWQiOiI4YTk2Yzg4MjhjMzc4YjcxMDE4YzM3ZDdmMDYyNTE3YyIsImRldmljZUlkIjoiYmI1MWZlOGY5OTViNDZjZGYyNzIxMTA1MDcxY2ZmMGEiLCJpYXQiOjE3OTEzODYxMzh9.ifdnhVYQSAcLWQPviedZsgV_6iOHyKLMsueCYWWFP9E" \
  -H "Cookie: remember-me=ZkxIM3UwSGQ0Q2NSVUlQSzdLRU12dyUzRCUzRDoxeThsJTJGTXdGZ3IxYyUyRktrcWVDTjZDUSUzRCUzRA; JSESSIONID=MjJhNmMwMWEtNmQyNy00NmUwLTg3OGYtYTExZjY0NjNiMzQ5" \
  -H "Content-Type: application/json" \
  -H "loggedInPersonTag: OWNER" \
  -d '{
    "additionalUsers": [
      {
        "apartmentId": "8a9690b484b034710184b046ff5d07b2",
        "isFamilyMember": true,
        "name": "B",
        "personId": "8a96c9828c36dad8018c3783a77b2553",
        "price": 0
      }
    ],
    "amount": 0,
    "apartmentId": "8a9690b484b034710184b046ff5d07b2",
    "bookedEntityId": "8a96998285aea12d0185aefccb263bcb",
    "date": "10/10/2026",
    "endDate": "10/10/2026",
    "entityType": "FACILITY",
    "slotList": [
      {
        "fromTime": "2026-10-10T06:00:00",
        "toTime": "2026-10-10T06:30:00"
      }
    ],
    "societyId": "8a9690b384afa23a0184b0009286114d",
    "unit": 1,
    "unitId": "8a96998285aea12d0185aefccb263bcf"
  }'
EOF

echo ""
echo "---"
echo ""

# ============================================================
# CURL 2: Unit 1 - 6:30 AM - 7:00 AM
# ============================================================
echo "2️⃣  CURL 2: Unit 1 - 6:30 AM - 7:00 AM Slot"
echo "Command:"
echo ""
cat << 'EOF'
curl -X POST "https://www.nobrokerhood.com/booking/secured/v2/resident/new" \
  -H "access-token: eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU9yRW1haWwiOiI5NjExMTU2MTYxIiwiZXhwIjoxODA3MDM2MjAwLCJ1c2VySWQiOiI4YTk2Yzg4MjhjMzc4YjcxMDE4YzM3ZDdmMDYyNTE3YyIsImRldmljZUlkIjoiYmI1MWZlOGY5OTViNDZjZGYyNzIxMTA1MDcxY2ZmMGEiLCJpYXQiOjE3OTEzODYxMzh9.ifdnhVYQSAcLWQPviedZsgV_6iOHyKLMsueCYWWFP9E" \
  -H "Cookie: remember-me=ZkxIM3UwSGQ0Q2NSVUlQSzdLRU12dyUzRCUzRDoxeThsJTJGTXdGZ3IxYyUyRktrcWVDTjZDUSUzRCUzRA; JSESSIONID=MjJhNmMwMWEtNmQyNy00NmUwLTg3OGYtYTExZjY0NjNiMzQ5" \
  -H "Content-Type: application/json" \
  -H "loggedInPersonTag: OWNER" \
  -d '{
    "additionalUsers": [
      {
        "apartmentId": "8a9690b484b034710184b046ff5d07b2",
        "isFamilyMember": true,
        "name": "B",
        "personId": "8a96c9828c36dad8018c3783a77b2553",
        "price": 0
      }
    ],
    "amount": 0,
    "apartmentId": "8a9690b484b034710184b046ff5d07b2",
    "bookedEntityId": "8a96998285aea12d0185aefccb263bcb",
    "date": "10/10/2026",
    "endDate": "10/10/2026",
    "entityType": "FACILITY",
    "slotList": [
      {
        "fromTime": "2026-10-10T06:30:00",
        "toTime": "2026-10-10T07:00:00"
      }
    ],
    "societyId": "8a9690b384afa23a0184b0009286114d",
    "unit": 1,
    "unitId": "8a96998285aea12d0185aefccb263bcf"
  }'
EOF

echo ""
echo "---"
echo ""

# ============================================================
# CURL 3: Unit 1 - 7:00 AM - 7:30 AM
# ============================================================
echo "3️⃣  CURL 3: Unit 1 - 7:00 AM - 7:30 AM Slot"
echo "Command:"
echo ""
cat << 'EOF'
curl -X POST "https://www.nobrokerhood.com/booking/secured/v2/resident/new" \
  -H "access-token: eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU9yRW1haWwiOiI5NjExMTU2MTYxIiwiZXhwIjoxODA3MDM2MjAwLCJ1c2VySWQiOiI4YTk2Yzg4MjhjMzc4YjcxMDE4YzM3ZDdmMDYyNTE3YyIsImRldmljZUlkIjoiYmI1MWZlOGY5OTViNDZjZGYyNzIxMTA1MDcxY2ZmMGEiLCJpYXQiOjE3OTEzODYxMzh9.ifdnhVYQSAcLWQPviedZsgV_6iOHyKLMsueCYWWFP9E" \
  -H "Cookie: remember-me=ZkxIM3UwSGQ0Q2NSVUlQSzdLRU12dyUzRCUzRDoxeThsJTJGTXdGZ3IxYyUyRktrcWVDTjZDUSUzRCUzRA; JSESSIONID=MjJhNmMwMWEtNmQyNy00NmUwLTg3OGYtYTExZjY0NjNiMzQ5" \
  -H "Content-Type: application/json" \
  -H "loggedInPersonTag: OWNER" \
  -d '{
    "additionalUsers": [
      {
        "apartmentId": "8a9690b484b034710184b046ff5d07b2",
        "isFamilyMember": true,
        "name": "B",
        "personId": "8a96c9828c36dad8018c3783a77b2553",
        "price": 0
      }
    ],
    "amount": 0,
    "apartmentId": "8a9690b484b034710184b046ff5d07b2",
    "bookedEntityId": "8a96998285aea12d0185aefccb263bcb",
    "date": "10/10/2026",
    "endDate": "10/10/2026",
    "entityType": "FACILITY",
    "slotList": [
      {
        "fromTime": "2026-10-10T07:00:00",
        "toTime": "2026-10-10T07:30:00"
      }
    ],
    "societyId": "8a9690b384afa23a0184b0009286114d",
    "unit": 1,
    "unitId": "8a96998285aea12d0185aefccb263bcf"
  }'
EOF

echo ""
echo "---"
echo ""

# ============================================================
# CURL 4: Unit 2 - 6:00 AM - 6:30 AM
# ============================================================
echo "4️⃣  CURL 4: Unit 2 - 6:00 AM - 6:30 AM Slot"
echo "Command:"
echo ""
cat << 'EOF'
curl -X POST "https://www.nobrokerhood.com/booking/secured/v2/resident/new" \
  -H "access-token: eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU9yRW1haWwiOiI5NjExMTU2MTYxIiwiZXhwIjoxODA3MDM2MjAwLCJ1c2VySWQiOiI4YTk2Yzg4MjhjMzc4YjcxMDE4YzM3ZDdmMDYyNTE3YyIsImRldmljZUlkIjoiYmI1MWZlOGY5OTViNDZjZGYyNzIxMTA1MDcxY2ZmMGEiLCJpYXQiOjE3OTEzODYxMzh9.ifdnhVYQSAcLWQPviedZsgV_6iOHyKLMsueCYWWFP9E" \
  -H "Cookie: remember-me=ZkxIM3UwSGQ0Q2NSVUlQSzdLRU12dyUzRCUzRDoxeThsJTJGTXdGZ3IxYyUyRktrcWVDTjZDUSUzRCUzRA; JSESSIONID=MjJhNmMwMWEtNmQyNy00NmUwLTg3OGYtYTExZjY0NjNiMzQ5" \
  -H "Content-Type: application/json" \
  -H "loggedInPersonTag: OWNER" \
  -d '{
    "additionalUsers": [
      {
        "apartmentId": "8a9690b484b034710184b046ff5d07b2",
        "isFamilyMember": true,
        "name": "B",
        "personId": "8a96c9828c36dad8018c3783a77b2553",
        "price": 0
      }
    ],
    "amount": 0,
    "apartmentId": "8a9690b484b034710184b046ff5d07b2",
    "bookedEntityId": "8a96998285aea12d0185aefccb263bcb",
    "date": "10/10/2026",
    "endDate": "10/10/2026",
    "entityType": "FACILITY",
    "slotList": [
      {
        "fromTime": "2026-10-10T06:00:00",
        "toTime": "2026-10-10T06:30:00"
      }
    ],
    "societyId": "8a9690b384afa23a0184b0009286114d",
    "unit": 2,
    "unitId": "8a96b68291b5bf710191b65d0d09543d"
  }'
EOF

echo ""
echo "---"
echo ""

# ============================================================
# CURL 5: Unit 2 - 6:30 AM - 7:00 AM
# ============================================================
echo "5️⃣  CURL 5: Unit 2 - 6:30 AM - 7:00 AM Slot"
echo "Command:"
echo ""
cat << 'EOF'
curl -X POST "https://www.nobrokerhood.com/booking/secured/v2/resident/new" \
  -H "access-token: eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU9yRW1haWwiOiI5NjExMTU2MTYxIiwiZXhwIjoxODA3MDM2MjAwLCJ1c2VySWQiOiI4YTk2Yzg4MjhjMzc4YjcxMDE4YzM3ZDdmMDYyNTE3YyIsImRldmljZUlkIjoiYmI1MWZlOGY5OTViNDZjZGYyNzIxMTA1MDcxY2ZmMGEiLCJpYXQiOjE3OTEzODYxMzh9.ifdnhVYQSAcLWQPviedZsgV_6iOHyKLMsueCYWWFP9E" \
  -H "Cookie: remember-me=ZkxIM3UwSGQ0Q2NSVUlQSzdLRU12dyUzRCUzRDoxeThsJTJGTXdGZ3IxYyUyRktrcWVDTjZDUSUzRCUzRA; JSESSIONID=MjJhNmMwMWEtNmQyNy00NmUwLTg3OGYtYTExZjY0NjNiMzQ5" \
  -H "Content-Type: application/json" \
  -H "loggedInPersonTag: OWNER" \
  -d '{
    "additionalUsers": [
      {
        "apartmentId": "8a9690b484b034710184b046ff5d07b2",
        "isFamilyMember": true,
        "name": "B",
        "personId": "8a96c9828c36dad8018c3783a77b2553",
        "price": 0
      }
    ],
    "amount": 0,
    "apartmentId": "8a9690b484b034710184b046ff5d07b2",
    "bookedEntityId": "8a96998285aea12d0185aefccb263bcb",
    "date": "10/10/2026",
    "endDate": "10/10/2026",
    "entityType": "FACILITY",
    "slotList": [
      {
        "fromTime": "2026-10-10T06:30:00",
        "toTime": "2026-10-10T07:00:00"
      }
    ],
    "societyId": "8a9690b384afa23a0184b0009286114d",
    "unit": 2,
    "unitId": "8a96b68291b5bf710191b65d0d09543d"
  }'
EOF

echo ""
echo "---"
echo ""

# ============================================================
# CURL 6: Unit 2 - 7:00 AM - 7:30 AM
# ============================================================
echo "6️⃣  CURL 6: Unit 2 - 7:00 AM - 7:30 AM Slot"
echo "Command:"
echo ""
cat << 'EOF'
curl -X POST "https://www.nobrokerhood.com/booking/secured/v2/resident/new" \
  -H "access-token: eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU9yRW1haWwiOiI5NjExMTU2MTYxIiwiZXhwIjoxODA3MDM2MjAwLCJ1c2VySWQiOiI4YTk2Yzg4MjhjMzc4YjcxMDE4YzM3ZDdmMDYyNTE3YyIsImRldmljZUlkIjoiYmI1MWZlOGY5OTViNDZjZGYyNzIxMTA1MDcxY2ZmMGEiLCJpYXQiOjE3OTEzODYxMzh9.ifdnhVYQSAcLWQPviedZsgV_6iOHyKLMsueCYWWFP9E" \
  -H "Cookie: remember-me=ZkxIM3UwSGQ0Q2NSVUlQSzdLRU12dyUzRCUzRDoxeThsJTJGTXdGZ3IxYyUyRktrcWVDTjZDUSUzRCUzRA; JSESSIONID=MjJhNmMwMWEtNmQyNy00NmUwLTg3OGYtYTExZjY0NjNiMzQ5" \
  -H "Content-Type: application/json" \
  -H "loggedInPersonTag: OWNER" \
  -d '{
    "additionalUsers": [
      {
        "apartmentId": "8a9690b484b034710184b046ff5d07b2",
        "isFamilyMember": true,
        "name": "B",
        "personId": "8a96c9828c36dad8018c3783a77b2553",
        "price": 0
      }
    ],
    "amount": 0,
    "apartmentId": "8a9690b484b034710184b046ff5d07b2",
    "bookedEntityId": "8a96998285aea12d0185aefccb263bcb",
    "date": "10/10/2026",
    "endDate": "10/10/2026",
    "entityType": "FACILITY",
    "slotList": [
      {
        "fromTime": "2026-10-10T07:00:00",
        "toTime": "2026-10-10T07:30:00"
      }
    ],
    "societyId": "8a9690b384afa23a0184b0009286114d",
    "unit": 2,
    "unitId": "8a96b68291b5bf710191b65d0d09543d"
  }'
EOF

echo ""
echo "=================================================="
echo "✨ Summary:"
echo "=================================================="
echo ""
echo "📋 6 Different Curl Commands:"
echo "1️⃣  Unit 1 - 6:00 AM - 6:30 AM"
echo "2️⃣  Unit 1 - 6:30 AM - 7:00 AM"
echo "3️⃣  Unit 1 - 7:00 AM - 7:30 AM"
echo "4️⃣  Unit 2 - 6:00 AM - 6:30 AM"
echo "5️⃣  Unit 2 - 6:30 AM - 7:00 AM"
echo "6️⃣  Unit 2 - 7:00 AM - 7:30 AM"
echo ""
echo "📅 All bookings for: 2026-10-10"
echo "🔗 API Endpoint: https://www.nobrokerhood.com/booking/secured/v2/resident/new"
echo ""
echo "💡 How to use:"
echo "- Copy any curl command above"
echo "- Paste in terminal"
echo "- Press Enter"
echo ""
echo "✅ Done!"
