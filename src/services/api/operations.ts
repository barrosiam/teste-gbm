import type { VercelRequest, VercelResponse } from '@vercel/node'
import { put, list, del as blobDel } from '@vercel/blob'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

type Operation = {
  id: string
  name: string
  description: string
  type: 'Embarque' | 'Desembarque'
  terminal:
    | 'Terminal Norte'
    | 'Terminal Sul'
    | 'Terminal Leste'
    | 'Terminal Oeste'
    | string
  status: 'Criada' | 'Processando' | 'Finalizada' | string
}

const BLOB_NAME = '../../db/db.json'

async function loadDb(): Promise<{ operations: Operation[] }> {
  const { blobs } = await list({ prefix: BLOB_NAME })
  const blob = blobs.find((b) => b.pathname === BLOB_NAME)

  if (blob) {
    const res = await fetch(blob.url)
    if (res.ok) return (await res.json()) as { operations: Operation[] }
  }

  const seedPath = path.join(process.cwd(), 'data', 'db.seed.json')
  const raw = fs.readFileSync(seedPath, 'utf-8')
  return JSON.parse(raw)
}

async function saveDb(db: { operations: Operation[] }) {
  await put(BLOB_NAME, JSON.stringify(db, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
}

function notFound(res: VercelResponse) {
  res.status(404).json({ error: 'Not found' })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = new URL(req.url || '', 'http://localhost')
    const parts = url.pathname.split('/').filter(Boolean) // ex: ['api','operations','123']
    const hasId = parts.length >= 3
    const id = hasId ? parts[2] : null

    const db = await loadDb()

    if (req.method === 'GET' && !hasId) {
      const q = url.searchParams.get('q')?.toLowerCase()
      const data = q
        ? db.operations.filter(
            (o) =>
              o.name.toLowerCase().includes(q) ||
              o.description.toLowerCase().includes(q) ||
              o.terminal.toLowerCase().includes(q) ||
              o.type.toLowerCase().includes(q) ||
              o.status.toLowerCase().includes(q),
          )
        : db.operations
      return res.status(200).json(data)
    }

    if (req.method === 'GET' && hasId) {
      const item = db.operations.find((o) => o.id === id)
      return item ? res.status(200).json(item) : notFound(res)
    }

    if (req.method === 'POST') {
      const body = (req.body || {}) as Partial<Operation>
      const newItem: Operation = {
        id: body.id || randomUUID().slice(0, 8),
        name: body.name || '',
        description: body.description || '',
        type: (body.type as Operation['type']) || 'Embarque',
        terminal: body.terminal || 'Terminal Norte',
        status: body.status || 'Criada',
      }
      db.operations.unshift(newItem)
      await saveDb(db)
      return res.status(201).json(newItem)
    }

    if ((req.method === 'PUT' || req.method === 'PATCH') && hasId) {
      const idx = db.operations.findIndex((o) => o.id === id)
      if (idx === -1) return notFound(res)
      const current = db.operations[idx]
      const body = (req.body || {}) as Partial<Operation>
      const updated: Operation = {
        ...current,
        ...body,
        id: current.id, // não deixa trocar id
      }
      db.operations[idx] = updated
      await saveDb(db)
      return res.status(200).json(updated)
    }

    if (req.method === 'DELETE' && hasId) {
      const before = db.operations.length
      db.operations = db.operations.filter((o) => o.id !== id)
      if (db.operations.length === before) return notFound(res)
      await saveDb(db)
      return res.status(204).end()
    }

    res.setHeader('Allow', 'GET,POST,PUT,PATCH,DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Internal error', detail: e })
  }
}
