// pages/api/booking.js
import { kv } from '@vercel/kv';

const API_URL = 'https://www.nobrokerhood.com/booking/secured/v2/resident/new';

const bookingConfigs = [
  {
    id: 'curl1',
    name: 'Unit 1 - 6:00 AM - 6:30 AM',
    unit: 1,
    unitId: '8a96998285aea12d0185aefccb263bcf',
    timeSlot: { from: '06:00:00', to: '06:30:00' }
  },
  {
    id: 'curl2',
    name: 'Unit 1 - 6:30 AM - 7:00 AM',
    unit: 1,
    unitId: '8a96998285aea12d0185aefccb263bcf',
    timeSlot: { from: '06:30:00', to: '07:00:00' }
  },
  {
    id: 'curl3',
    name: 'Unit 1 - 7:00 AM - 7:30 AM',
    unit: 1,
    unitId: '8a96998285aea12d0185aefccb263bcf',
    timeSlot: { from: '07:00:00', to: '07:30:00' }
  },
  {
    id: 'curl4',
    name: 'Unit 2 - 6:00 AM - 6:30 AM',
    unit: 2,
    unitId: '8a96b68291b5bf710191b65d0d09543d',
    timeSlot: { from: '06:00:00', to: '06:30:00' }
  },
  {
    id: 'curl5',
    name: 'Unit 2 - 6:30 AM - 7:00 AM',
    unit: 2,
    unitId: '8a96b68291b5bf710191b65d0d09543d',
    timeSlot: { from: '06:30:00', to: '07:00:00' }
  },
  {
    id: 'curl6',
    name: 'Unit 2 - 7:00 AM - 7:30 AM',
    unit: 2,
    unitId: '8a96b68291b5bf710191b65d0d09543d',
    timeSlot: { from: '07:00:00', to: '07:30:00' }
  }
];

function getBookingDate() {
  const today = new Date();
  const thirdDay = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  return thirdDay.toLocaleDateString('en-GB');
}

function createPayload(config) {
  const date = getBookingDate();
  const dateISO = new Date().toISOString().split('T')[0];
  const thirdDay = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
  const thirdDayISO = thirdDay.toISOString().split('T')[0];

  return {
    additionalUsers: [
      {
        apartmentId: '8a9690b484b034710184b046ff5d07b2',
        isFamilyMember: true,
        name: 'B',
        personId: '8a96c9828c36dad8018c3783a77b2553',
        price: 0
      }
    ],
    amount: 0,
    apartmentId: '8a9690b484b034710184b046ff5d07b2',
    bookedEntityId: '8a96998285aea12d0185aefccb263bcb',
    date: date,
    endDate: date,
    entityType: 'FACILITY',
    slotList: [
      {
        fromTime: `${thirdDayISO}T${config.timeSlot.from}`,
        toTime: `${thirdDayISO}T${config.timeSlot.to}`
      }
    ],
    societyId: '8a9690b384afa23a0184b0009286114d',
    unit: config.unit,
    unitId: config.unitId
  };
}

async function makeBooking(config) {
  try {
    const payload = createPayload(config);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'access-token': process.env.NOBROKER_TOKEN,
        'Cookie': process.env.NOBROKER_COOKIES,
        'Content-Type': 'application/json',
        'loggedInPersonTag': 'OWNER'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    const result = {
      id: config.id,
      name: config.name,
      status: response.status,
      statusText: response.statusText,
      apiStatus: data.sts,
      message: data.msg,
      timestamp: new Date().toISOString(),
      booked: data.sts === 1
    };

    return result;
  } catch (error) {
    return {
      id: config.id,
      name: config.name,
      status: 500,
      error: error.message,
      timestamp: new Date().toISOString(),
      booked: false
    };
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const results = await Promise.all(
        bookingConfigs.map(config => makeBooking(config))
      );

      // Save to KV database
      const execution = {
        timestamp: new Date().toISOString(),
        status: 'completed',
        results: results,
        successful: results.filter(r => r.booked).length,
        total: results.length
      };

      await kv.lpush('booking_executions', JSON.stringify(execution));
      await kv.ltrim('booking_executions', 0, 99); // Keep last 100

      res.status(200).json({
        success: true,
        execution: execution
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } else if (req.method === 'GET') {
    try {
      const executions = await kv.lrange('booking_executions', 0, -1);
      const parsedExecutions = executions.map(e => JSON.parse(e));

      res.status(200).json({
        success: true,
        executions: parsedExecutions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
