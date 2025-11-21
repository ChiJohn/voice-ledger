import { defineStore } from 'pinia'
import { db } from '../services/db'

export type TxnType = 'expense' | 'income' | 'transfer'

export interface Transaction {
  id: string
  type: TxnType
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

export const useTransactions = defineStore('transactions', {
  state: () => ({
    list: [] as Transaction[],
    loading: false
  }),
  actions: {
    async init() {
      this.loading = true
      const all = await db.listTransactions()
      this.list = all.sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
      this.loading = false
    },
    async add(txn: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
      const now = new Date().toISOString()
      const id = crypto.randomUUID()
      const full: Transaction = { ...txn, id, created_at: now, updated_at: now }
      await db.putTransaction(full)
      this.list.unshift(full)
    },
    async update(id: string, patch: Partial<Transaction>) {
      const idx = this.list.findIndex(x => x.id === id)
      if (idx === -1) return
      const now = new Date().toISOString()
      const merged = { ...this.list[idx], ...patch, updated_at: now }
      await db.putTransaction(merged)
      this.list.splice(idx, 1, merged)
    },
    async remove(id: string) {
      await db.deleteTransaction(id)
      this.list = this.list.filter(x => x.id !== id)
    }
  },
  getters: {
    totalToday: (state) => {
      const today = new Date()
      const d = today.toISOString().slice(0, 10)
      return state.list.filter(x => x.date_time.slice(0, 10) === d && x.type === 'expense').reduce((s, x) => s + x.amount, 0)
    },
    totalMonth: (state) => {
      const today = new Date()
      const m = today.toISOString().slice(0, 7)
      return state.list.filter(x => x.date_time.slice(0, 7) === m && x.type === 'expense').reduce((s, x) => s + x.amount, 0)
    }
  }
})