const DB_NAME = 'voice_ledger'
const DB_VERSION = 1

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = () => {
        const db = req.result
        if (!db.objectStoreNames.contains('transactions')) {
          const s = db.createObjectStore('transactions', { keyPath: 'id' })
          s.createIndex('date_time', 'date_time')
        }
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' })
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }
  return dbPromise
}

export type Transaction = {
  id: string
  type: 'expense' | 'income' | 'transfer'
  amount: number
  currency: string
  date_time: string
  category_id?: string
  account_id?: string
  merchant?: string
  tags?: string[]
  note?: string
  source: 'voice' | 'text'
  status: 'confirmed' | 'draft'
  confidence: number
  created_at: string
  updated_at: string
}

async function tx(store: string, mode: IDBTransactionMode) {
  const db = await openDB()
  return db.transaction(store, mode).objectStore(store)
}

export const db = {
  async putTransaction(item: Transaction) {
    const s = await tx('transactions', 'readwrite')
    return new Promise((resolve, reject) => {
      const r = s.put(item)
      r.onsuccess = () => resolve(true)
      r.onerror = () => reject(r.error)
    })
  },
  async deleteTransaction(id: string) {
    const s = await tx('transactions', 'readwrite')
    return new Promise((resolve, reject) => {
      const r = s.delete(id)
      r.onsuccess = () => resolve(true)
      r.onerror = () => reject(r.error)
    })
  },
  async listTransactions(): Promise<Transaction[]> {
    const s = await tx('transactions', 'readonly')
    return new Promise((resolve, reject) => {
      const r = s.getAll()
      r.onsuccess = () => resolve(r.result as Transaction[])
      r.onerror = () => reject(r.error)
    })
  }
}