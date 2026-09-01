import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import { neon } from '@neondatabase/serverless';
import {
  initializeSchema,
  getItemsByUser,
  createItem,
  updateItem,
  deleteItem,
  getCollectionsByUser,
  createCollection,
  updateCollection,
  deleteCollection,
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const getAuthBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://remor.vercel.app';
};

const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: getAuthBaseUrl(),
  basePath: '/api/auth',
  trustedOrigins: [
    'https://remor.vercel.app',
    'http://localhost:5173',
    'http://localhost:3001',
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    cookieSameSite: 'lax',
    cookieSecure: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// ── Auth routes (Better Auth handler) ────────────────────────
app.use('/api/auth', toNodeHandler(auth));

// ── Session verification middleware ─────────────────────────
async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = session.user;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// ── Items API ────────────────────────────────────────────────
app.get('/api/items', requireAuth, async (req, res) => {
  try {
    const rows = await getItemsByUser(req.user.id);
    // Map snake_case DB columns → camelCase for frontend
    const items = rows.map(dbToItem);
    res.json(items);
  } catch (err) {
    console.error('[GET /api/items]', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/items', requireAuth, async (req, res) => {
  try {
    const row = await createItem(req.user.id, req.body);
    res.json(dbToItem(row));
  } catch (err) {
    console.error('[POST /api/items]', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/items/:id', requireAuth, async (req, res) => {
  try {
    const row = await updateItem(req.params.id, req.user.id, req.body);
    res.json(row ? dbToItem(row) : { ok: true });
  } catch (err) {
    console.error('[PUT /api/items/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/items/:id', requireAuth, async (req, res) => {
  try {
    await deleteItem(req.params.id, req.user.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/items/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Collections API ──────────────────────────────────────────
app.get('/api/collections', requireAuth, async (req, res) => {
  try {
    const rows = await getCollectionsByUser(req.user.id);
    res.json(rows.map(dbToCollection));
  } catch (err) {
    console.error('[GET /api/collections]', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/collections', requireAuth, async (req, res) => {
  try {
    const row = await createCollection(req.user.id, req.body);
    res.json(dbToCollection(row));
  } catch (err) {
    console.error('[POST /api/collections]', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/collections/:id', requireAuth, async (req, res) => {
  try {
    const row = await updateCollection(req.params.id, req.user.id, req.body);
    res.json(row ? dbToCollection(row) : { ok: true });
  } catch (err) {
    console.error('[PUT /api/collections/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/collections/:id', requireAuth, async (req, res) => {
  try {
    await deleteCollection(req.params.id, req.user.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/collections/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

// ── DB row → JS object mappers ───────────────────────────────
function dbToItem(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    content: row.content,
    url: row.url,
    tags: row.tags || [],
    collectionId: row.collection_id,
    status: row.status,
    priority: row.priority,
    starred: row.starred,
    reminder: row.reminder,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    viewedAt: row.viewed_at,
    viewCount: row.view_count,
    aiTags: row.ai_tags || [],
    similarIds: [],
    notes: row.notes || '',
  };
}

function dbToCollection(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    createdAt: row.created_at,
  };
}

// ── Start ────────────────────────────────────────────────────
async function start() {
  await initializeSchema();
  app.listen(PORT, () => {
    console.log(`[API] Server running at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  start();
}

export default app;
