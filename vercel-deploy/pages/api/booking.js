// pages/api/booking.js
import { readJsonStore, writeJsonStore } from '../../lib/booking-store';

const API_URL = 'https://www.nobrokerhood.com/booking/secured/v2/resident/new';
const EXECUTIONS_KEY = 'booking-executions.json';

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
    name: 'Unit 1 - 7:30 AM - 8:00 AM',
    unit: 1,
    unitId: '8a96998285aea12d0185aefccb263bcf',
    timeSlot: { from: '07:30:00', to: '08:00:00' }
  },
  {
    id: 'curl5',
    name: 'Unit 2 - 6:00 AM - 6:30 AM',
    unit: 2,
    unitId: '8a96b68291b5bf710191b65d0d09543d',
    timeSlot: { from: '06:00:00', to: '06:30:00' }
  },
  {
    id: 'curl6',
    name: 'Unit 2 - 6:30 AM - 7:00 AM',
    unit: 2,
    unitId: '8a96b68291b5bf710191b65d0d09543d',
    timeSlot: { from: '06:30:00', to: '07:00:00' }
  },
  {
    id: 'curl7',
    name: 'Unit 2 - 7:00 AM - 7:30 AM',
    unit: 2,
    unitId: '8a96b68291b5bf710191b65d0d09543d',
    timeSlot: { from: '07:00:00', to: '07:30:00' }
  },
  {
    id: 'curl8',
    name: 'Unit 2 - 7:30 AM - 8:00 AM',
    unit: 2,
    unitId: '8a96b68291b5bf710191b65d0d09543d',
    timeSlot: { from: '07:30:00', to: '08:00:00' }
  }
];

function getBookingDate() {
  const bookingDate = new Date();
  bookingDate.setDate(bookingDate.getDate() + 2);

  const year = bookingDate.getFullYear();
  const month = String(bookingDate.getMonth() + 1).padStart(2, '0');
  const day = String(bookingDate.getDate()).padStart(2, '0');

  return {
    formatted: `${day}/${month}/${year}`,
    iso: `${year}-${month}-${day}`
  };
}

function createPayload(config, bookingDate) {
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
    date: bookingDate.formatted,
    endDate: bookingDate.formatted,
    entityType: 'FACILITY',
    slotList: [
      {
        fromTime: `${bookingDate.iso}T${config.timeSlot.from}`,
        toTime: `${bookingDate.iso}T${config.timeSlot.to}`
      }
    ],
    societyId: '8a9690b384afa23a0184b0009286114d',
    unit: config.unit,
    unitId: config.unitId
  };
}

async function makeBooking(config, bookingDate) {
  try {
    const payload = createPayload(config, bookingDate);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'access-token': process.env.NOBROKER_TOKEN,
        'Cookie': process.env.NOBROKER_COOKIES,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'loggedInPersonTag': 'OWNER'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    const contentType = response.headers.get('content-type') || 'unknown';
    let data;

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      const isHtml = contentType.includes('text/html') || /^\s*<!doctype html|^\s*<html/i.test(responseText);

      return {
        id: config.id,
        name: config.name,
        status: response.status,
        statusText: response.statusText,
        contentType,
        error: isHtml
          ? `NoBroker returned an HTML page instead of JSON (HTTP ${response.status}). The access token or cookies may be expired, or the request may have been blocked.`
          : `NoBroker returned an invalid JSON response (HTTP ${response.status}, content type: ${contentType}).`,
        timestamp: new Date().toISOString(),
        booked: false
      };
    }

    const result = {
      id: config.id,
      name: config.name,
      status: response.status,
      statusText: response.statusText,
      contentType,
      apiStatus: data.sts,
      message: data.msg || response.statusText || 'No response message provided',
      timestamp: new Date().toISOString(),
      booked: response.ok && data.sts === 1
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
    let execution;
    let executions = [];
    let warning = null;
    let storageMode = process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'local';
    try {
      executions = await readJsonStore(EXECUTIONS_KEY, []);
    } catch (error) {
      warning = `Could not read previous execution history: ${error.message}`;
    }

    try {
      const bookingDate = getBookingDate();
      const results = await Promise.all(
        bookingConfigs.map(config => makeBooking(config, bookingDate))
      );

      const trigger = req.body?.trigger === 'scheduled' ? 'scheduled' : 'manual';
      execution = {
        timestamp: new Date().toISOString(),
        trigger,
        bookingDate: bookingDate.formatted,
        summary: `${trigger === 'scheduled' ? 'Scheduled' : 'On-demand'} booking run finished: ${results.filter(result => result.booked).length} of ${results.length} bookings succeeded.`,
        status: 'completed',
        results: results,
        successful: results.filter(r => r.booked).length,
        total: results.length
      };

      try {
        const updatedExecutions = [execution, ...executions].slice(0, 100);
        const storage = await writeJsonStore(EXECUTIONS_KEY, updatedExecutions);
        storageMode = storage.mode;
        warning = [warning, storage.warning].filter(Boolean).join(' ') || null;
      } catch (error) {
        warning = [warning, `Booking completed, but execution history could not be saved: ${error.message}`]
          .filter(Boolean)
          .join(' ');
      }

      res.status(200).json({
        success: true,
        execution,
        storage: storageMode,
        warning,
        logMessage: execution.summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        execution: execution || null
      });
    }
  } else if (req.method === 'GET') {
    try {
      const executions = await readJsonStore(EXECUTIONS_KEY, []);
      const actionLogs = await readJsonStore('booking-actions.json', []);

      res.status(200).json({
        success: true,
        executions,
        actionLogs,
        storage: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'local'
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
