<template>
  <div>
    <div class="controls">
      <button class="primary" @click="onStart" :disabled="listening">开始录音</button>
      <button @click="onStop" :disabled="!listening">停止</button>
    </div>
    <textarea v-model="text" rows="3" placeholder="说话或输入：比如‘中午吃饭30记餐饮’"></textarea>
    <div class="chips">
      <div class="chip">金额：{{ parsed.amount ?? '未识别' }}</div>
      <div class="chip">类别：{{ parsed.category ?? '未识别' }}</div>
      <div class="chip">日期：{{ dateStr }}</div>
      <div class="chip">置信度：{{ (parsed.confidence*100).toFixed(0) }}%</div>
    </div>
    <div class="actions">
      <button class="primary" @click="onConfirm" :disabled="!canConfirm">确认记账</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { speech } from '../services/speech'
import { parseText } from '../services/nlu'
import { useTransactions } from '../stores/transactions'

const store = useTransactions()
store.init()

const text = ref('')
const listening = ref(false)
const parsed = ref(parseText(''))
let rec: any = null

watch(text, (t) => {
  parsed.value = parseText(t)
})

const dateStr = computed(() => {
  const d = parsed.value.date_time
  return d ? new Date(d).toLocaleString() : ''
})

const canConfirm = computed(() => {
  return !!parsed.value.amount && parsed.value.confidence >= 0.7
})

function onStart() {
  if (!speech.isSupported()) return
  listening.value = true
  rec = speech.startStream(r => {
    text.value = r.text
    if (r.isFinal) listening.value = false
  })
}

function onStop() {
  listening.value = false
  speech.stop(rec)
}

async function onConfirm() {
  if (!canConfirm.value || !parsed.value.amount) return
  const p = parsed.value
  await store.add({
    type: p.intent === 'AddIncome' ? 'income' : p.intent === 'Transfer' ? 'transfer' : 'expense',
    amount: p.amount,
    currency: p.currency || 'CNY',
    date_time: p.date_time || new Date().toISOString(),
    category_id: p.category,
    account_id: undefined,
    merchant: undefined,
    tags: [],
    note: text.value,
    source: 'voice',
    status: 'confirmed',
    confidence: p.confidence
  })
  text.value = ''
  parsed.value = parseText('')
}
</script>

<style scoped>
.controls{display:flex;gap:8px;margin-bottom:8px}
.actions{margin-top:12px}
</style>