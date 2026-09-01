import app from '../server/index.js';
import { initializeSchema } from '../server/db.js';

let isDbInitialized = false;

export default async function handler(req, res) {
  if (!isDbInitialized) {
    try {
      await initializeSchema();
      isDbInitialized = true;
    } catch (err) {
      console.error('[Vercel DB Init Error]', err);
    }
  }
  return app(req, res);
}
