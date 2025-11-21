<template>
  <main>
    <section>
      <h1>语音记账</h1>
      <RecordPanel />
    </section>
    <section>
      <ReportPanel />
    </section>
  </main>
</template>

<script setup lang="ts">
import RecordPanel from './components/RecordPanel.vue'
import ReportPanel from './components/ReportPanel.vue'
</script>

<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
main{max-width:720px;margin:0 auto;padding:16px}
section{margin-bottom:24px}
button{padding:10px 16px;border-radius:8px;border:1px solid #ccc;background:#fff}
button.primary{background:#1677ff;color:#fff;border-color:#1677ff}
input,textarea{width:100%;padding:10px;border:1px solid #ddd;border-radius:8px}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.chip{padding:6px 10px;border-radius:999px;border:1px solid #ddd;background:#f8f8f8}
</style>