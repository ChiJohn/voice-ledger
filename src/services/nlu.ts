export type ParsedIntent = 'AddExpense' | 'AddIncome' | 'Transfer'

export type ParsedResult = {
  intent: ParsedIntent
  amount?: number
  currency?: string
  date_time?: string
  category?: string
  note?: string
  confidence: number
}

const catMap: Record<string, string> = {
  '餐饮': '餐饮',
  '吃饭': '餐饮',
  '外卖': '餐饮',
  '咖啡': '餐饮',
  '出行': '出行',
  '打车': '出行',
  '交通': '出行',
  '生鲜': '生鲜',
  '买菜': '生鲜',
  '服饰': '服饰',
  '衣服': '服饰',
  '数码': '数码',
  '超市': '日用'
}

function parseDigits(text: string): number | undefined {
  const m = text.match(/([0-9]+(?:\.[0-9]+)?)/)
  if (!m) return undefined
  return parseFloat(m[1])
}

function parseDate(text: string): string | undefined {
  const now = new Date()
  if (text.includes('昨天')) {
    const d = new Date(now.getTime() - 24 * 3600 * 1000)
    return d.toISOString()
  }
  if (text.includes('前天')) {
    const d = new Date(now.getTime() - 2 * 24 * 3600 * 1000)
    return d.toISOString()
  }
  return now.toISOString()
}

function parseCategory(text: string): string | undefined {
  const keys = Object.keys(catMap)
  for (const k of keys) {
    if (text.includes(k)) return catMap[k]
  }
  return undefined
}

function parseIntent(text: string): ParsedIntent {
  if (text.includes('收入') || text.includes('进账')) return 'AddIncome'
  if (text.includes('转账')) return 'Transfer'
  return 'AddExpense'
}

export function parseText(text: string): ParsedResult {
  const amount = parseDigits(text)
  const date_time = parseDate(text)
  const category = parseCategory(text)
  const intent = parseIntent(text)
  const currency = 'CNY'
  const score = (amount ? 0.4 : 0) + (category ? 0.3 : 0) + 0.3
  return { intent, amount, currency, date_time, category, note: text, confidence: Math.min(1, score) }
}