import { get, list, put } from '@vercel/blob';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const LOCAL_STORAGE_PATH = process.env.VERCEL
  ? path.join(os.tmpdir(), 'vercel-deploy', 'data')
  : path.join(process.cwd(), 'data');

function localStorageWarning(reason) {
  const location = process.env.VERCEL
    ? 'temporary storage; data may not persist between function instances'
    : 'local storage';
  return `${reason} Using ${location}; configure Vercel Blob for persistent storage.`;
}

export async function readJsonStore(key, fallback) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const content = await fs.readFile(path.join(LOCAL_STORAGE_PATH, key), 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return fallback;
      }
      throw error;
    }
  }

  try {
    const listResult = await list({ prefix: key, limit: 1000 });
    const blob = listResult.blobs
      .filter(item => item.pathname === key || item.pathname.startsWith(`${key}-`))
      .sort((left, right) => new Date(right.uploadedAt) - new Date(left.uploadedAt))[0];

    if (!blob) {
      return fallback;
    }

    const blobContent = await get(blob.url, { access: 'private' });
    if (!blobContent) {
      return fallback;
    }

    return JSON.parse(await new Response(blobContent.stream).text());
  } catch (error) {
    console.warn(`Vercel Blob read failed for ${key}; falling back to local storage.`, error);
    try {
      const content = await fs.readFile(path.join(LOCAL_STORAGE_PATH, key), 'utf8');
      return JSON.parse(content);
    } catch (localError) {
      if (localError.code === 'ENOENT') {
        return fallback;
      }
      throw localError;
    }
  }
}

export async function writeJsonStore(key, value) {
  const content = JSON.stringify(value, null, 2);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    await fs.mkdir(LOCAL_STORAGE_PATH, { recursive: true });
    await fs.writeFile(path.join(LOCAL_STORAGE_PATH, key), content, 'utf8');
    return {
      mode: 'local',
      warning: localStorageWarning('Stored locally.')
    };
  }

  try {
    await put(key, content, {
      access: 'private',
      contentType: 'application/json'
    });
    return { mode: 'blob' };
  } catch (error) {
    console.warn(`Vercel Blob write failed for ${key}; falling back to local storage.`, error);
    await fs.mkdir(LOCAL_STORAGE_PATH, { recursive: true });
    await fs.writeFile(path.join(LOCAL_STORAGE_PATH, key), content, 'utf8');
    return {
      mode: 'local',
      warning: localStorageWarning(`Vercel Blob write failed: ${error.message}.`)
    };
  }
}
