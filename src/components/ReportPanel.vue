<template>
  <div>
    <div class="summary">
      <div>今日支出：¥{{ store.totalToday.toFixed(2) }}</div>
      <div>本月支出：¥{{ store.totalMonth.toFixed(2) }}</div>
    </div>
    <ul class="list">
      <li v-for="t in store.list" :key="t.id" class="item">
        <div class="row">
          <div class="left">{{ t.category_id || t.type }}</div>
          <div class="right">{{ new Date(t.date_time).toLocaleString() }}</div>
        </div>
        <div class="row">
          <div class="left">¥{{ t.amount.toFixed(2) }}</div>
          <div class="right">{{ t.note }}</div>
        </div>
      </li>
    </ul>
  </div>
  </template>

<script setup lang="ts">
import { useTransactions } from '../stores/transactions'
const store = useTransactions()
</script>

<style scoped>
.summary{display:flex;gap:24px;margin:12px 0}
.list{list-style:none;padding:0;margin:0}
.item{border-bottom:1px solid #eee;padding:12px 0}
.row{display:flex;justify-content:space-between}
.left{font-weight:600}
.right{color:#666}
</style>