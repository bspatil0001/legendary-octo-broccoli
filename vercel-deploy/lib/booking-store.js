import { list, put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'data');

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

  const result = await list({ prefix: key, limit: 1000 });
  const blob = result.blobs
    .filter(item => item.pathname === key || item.pathname.startsWith(`${key}-`))
    .sort((left, right) => new Date(right.uploadedAt) - new Date(left.uploadedAt))[0];

  if (!blob) {
    return fallback;
  }

  const response = await fetch(blob.url);
  if (!response.ok) {
    throw new Error(`Unable to read ${key}: ${response.status} ${response.statusText}`);
  }

  return JSON.parse(await response.text());
}

export async function writeJsonStore(key, value) {
  const content = JSON.stringify(value, null, 2);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    await fs.mkdir(LOCAL_STORAGE_PATH, { recursive: true });
    await fs.writeFile(path.join(LOCAL_STORAGE_PATH, key), content, 'utf8');
    return {
      mode: 'local',
      warning: 'Stored locally; configure BLOB_READ_WRITE_TOKEN for persistent deployment storage.'
    };
  }

  await put(key, content, {
    access: 'public',
    contentType: 'application/json'
  });
  return { mode: 'blob' };
}
