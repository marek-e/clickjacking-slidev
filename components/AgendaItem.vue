<script setup>
defineProps({
  n:    { type: [Number, String], required: true },
  demo: { type: Boolean, default: false },
})
</script>

<template>
  <div class="agenda-item">
    <span class="agenda-n">{{ n }}</span>
    <span class="agenda-label"><slot /></span>
    <span v-if="demo" class="agenda-demo">DEMO</span>
  </div>
</template>

<style scoped>
.agenda-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  font-size: 0.82em;
  color: #1f2937;
}

.agenda-n {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #374151;
  font-size: 0.75em;
  font-weight: 700;
  flex-shrink: 0;
}

.agenda-label {
  flex: 1;
  line-height: 1.3;
}

.agenda-demo {
  font-size: 0.65em;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #dc2626;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 4px;
  padding: 1px 5px;
  flex-shrink: 0;
}
</style>
