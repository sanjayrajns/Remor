import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import pg from 'pg';
const { Pool } = pg;

const sql = neon(process.env.DATABASE_URL);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function initializeSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'note',
      title TEXT DEFAULT '',
      content TEXT DEFAULT '',
      url TEXT,
      tags JSONB DEFAULT '[]',
      collection_id TEXT,
      status TEXT DEFAULT 'inbox',
      priority TEXT DEFAULT 'medium',
      starred BOOLEAN DEFAULT false,
      reminder TIMESTAMPTZ,
      due_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      viewed_at TIMESTAMPTZ,
      view_count INT DEFAULT 0,
      ai_tags JSONB DEFAULT '[]',
      notes TEXT DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '📁',
      color TEXT DEFAULT '#6B7280',
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      "emailVerified" BOOLEAN NOT NULL DEFAULT false,
      image TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      id TEXT PRIMARY KEY,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      token TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "account" (
      id TEXT PRIMARY KEY,
      "issuer" TEXT,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" TIMESTAMPTZ,
      "refreshTokenExpiresAt" TIMESTAMPTZ,
      scope TEXT,
      password TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // Migration: Add missing issuer column if table already existed without it
  await sql`
    ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "issuer" TEXT
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "verification" (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "createdAt" TIMESTAMPTZ DEFAULT now(),
      "updatedAt" TIMESTAMPTZ DEFAULT now()
    )
  `;

  console.log('[DB] Schema initialized (items, collections, auth tables)');
}

// ── Items ────────────────────────────────────────────────────

export async function getItemsByUser(userId) {
  return sql`
    SELECT * FROM items
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
}

export async function createItem(userId, item) {
  const now = new Date().toISOString();
  const {
    id, type, title, content, url, tags, collectionId,
    status, priority, starred, reminder, dueDate,
    createdAt, updatedAt, viewedAt, viewCount, aiTags, notes,
  } = item;

  const result = await sql`
    INSERT INTO items (
      id, user_id, type, title, content, url, tags, collection_id,
      status, priority, starred, reminder, due_date,
      created_at, updated_at, viewed_at, view_count, ai_tags, notes
    ) VALUES (
      ${id}, ${userId}, ${type}, ${title}, ${content}, ${url},
      ${JSON.stringify(tags || [])}, ${collectionId || null},
      ${status}, ${priority}, ${starred || false},
      ${reminder || null}, ${dueDate || null},
      ${createdAt || now}, ${updatedAt || now}, ${viewedAt || null},
      ${viewCount || 0}, ${JSON.stringify(aiTags || [])}, ${notes || ''}
    )
    RETURNING *
  `;
  return result[0];
}

export async function updateItem(id, userId, data) {
  const fields = [];
  const values = [];

  const mapping = {
    type: 'type', title: 'title', content: 'content', url: 'url',
    collectionId: 'collection_id', status: 'status', priority: 'priority',
    starred: 'starred', reminder: 'reminder', dueDate: 'due_date',
    updatedAt: 'updated_at', viewedAt: 'viewed_at', viewCount: 'view_count',
    notes: 'notes',
  };

  for (const [jsKey, dbCol] of Object.entries(mapping)) {
    if (data[jsKey] !== undefined) {
      fields.push(`${dbCol} = $${values.length + 1}`);
      values.push(data[jsKey]);
    }
  }

  if (data.tags !== undefined) {
    fields.push(`tags = $${values.length + 1}`);
    values.push(JSON.stringify(data.tags));
  }
  if (data.aiTags !== undefined) {
    fields.push(`ai_tags = $${values.length + 1}`);
    values.push(JSON.stringify(data.aiTags));
  }

  if (fields.length === 0) return null;

  values.push(id, userId);
  const query = `UPDATE items SET ${fields.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows?.[0];
}

export async function deleteItem(id, userId) {
  await sql`DELETE FROM items WHERE id = ${id} AND user_id = ${userId}`;
}

// ── Collections ──────────────────────────────────────────────

export async function getCollectionsByUser(userId) {
  return sql`
    SELECT * FROM collections
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `;
}

export async function createCollection(userId, col) {
  const result = await sql`
    INSERT INTO collections (id, user_id, name, icon, color, created_at)
    VALUES (${col.id}, ${userId}, ${col.name}, ${col.icon || '📁'}, ${col.color || '#6B7280'}, ${col.createdAt})
    RETURNING *
  `;
  return result[0];
}

export async function updateCollection(id, userId, data) {
  const { name, icon, color } = data;
  const result = await sql`
    UPDATE collections
    SET name = COALESCE(${name || null}, name),
        icon = COALESCE(${icon || null}, icon),
        color = COALESCE(${color || null}, color)
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `;
  return result[0];
}

export async function deleteCollection(id, userId) {
  await sql`DELETE FROM collections WHERE id = ${id} AND user_id = ${userId}`;
  // Unlink items from this collection
  await sql`UPDATE items SET collection_id = NULL WHERE collection_id = ${id} AND user_id = ${userId}`;
}

export default sql;
