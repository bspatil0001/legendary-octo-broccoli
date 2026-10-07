// pages/api/booking.js
import { put, list } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

const API_URL = 'https://www.nobrokerhood.com/booking/secured/v2/resident/new';
const EXECUTIONS_KEY = 'booking-executions.json';
const LOCAL_EXECUTIONS_PATH = path.join(process.cwd(), 'data', 'booking-executions.json');

async function readLocalExecutions() {
  try {
    const file = await fs.readFile(LOCAL_EXECUTIONS_PATH, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    return [];
  }
}

async function writeLocalExecutions(executions) {
  try {
    await fs.mkdir(path.dirname(LOCAL_EXECUTIONS_PATH), { recursive: true });
    await fs.writeFile(LOCAL_EXECUTIONS_PATH, JSON.stringify(executions, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Local execution log write failed:', error);
    return false;
  }
}

async function readStoredExecutions() {
  try {
    const result = await list({ prefix: EXECUTIONS_KEY, limit: 20 });
    const match = result.blobs.find(blob => blob.pathname === EXECUTIONS_KEY || blob.url.includes(EXECUTIONS_KEY));

    if (!match) {
      return readLocalExecutions();
    }

    const response = await fetch(match.url);
    if (!response.ok) {
      return readLocalExecutions();
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    return readLocalExecutions();
  }
}

async function persistExecutions(executions) {
  try {
    await put(EXECUTIONS_KEY, JSON.stringify(executions), { access: 'public' });
    return { mode: 'blob' };
  } catch (error) {
    console.warn('Vercel Blob is not configured or is unavailable. Falling back to local storage.', error.message);
    const saved = await writeLocalExecutions(executions);
    if (saved) {
      return { mode: 'local', warning: 'Stored locally because Vercel Blob is not configured.' };
    }

    return { mode: 'none', warning: 'Storage unavailable. No log file could be written.' };
  }
}

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

      const execution = {
        timestamp: new Date().toISOString(),
        status: 'completed',
        results: results,
        successful: results.filter(r => r.booked).length,
        total: results.length
      };

      const executions = await readStoredExecutions();

      // Add new execution and keep last 100
      const updatedExecutions = [execution, ...executions].slice(0, 100);
      const storage = await persistExecutions(updatedExecutions);

      res.status(200).json({
        success: true,
        execution,
        storage: storage.mode,
        warning: storage.warning || null
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } else if (req.method === 'GET') {
    try {
      const executions = await readStoredExecutions();

      res.status(200).json({
        success: true,
        executions,
        storage: 'blob-or-local'
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
