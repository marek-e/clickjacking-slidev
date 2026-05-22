<script setup>
const props = defineProps({
  variant: { type: String, default: 'info' },
  icon: { type: String, default: null },
  noIcon: { type: Boolean, default: false },
})

const configs = {
  note:       { bg: 'bg-yellow-50',  border: 'border-yellow-200', text: 'text-yellow-700',  defaultIcon: '📖' },
  warning:    { bg: 'bg-amber-50',   border: 'border-amber-300',  text: 'text-amber-700',   defaultIcon: '⚠️' },
  info:       { bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-700',    defaultIcon: '📝' },
  escalation: { bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-700',  defaultIcon: '🔗' },
  success:    { bg: 'bg-green-50',   border: 'border-green-200',  text: 'text-green-700',   defaultIcon: '✅' },
  error:      { bg: 'bg-red-50',     border: 'border-red-200',    text: 'text-red-700',     defaultIcon: '❌' },
  gray:       { bg: 'bg-gray-50',    border: 'border-gray-200',   text: 'text-gray-700',    defaultIcon: '💡' },
  purple:     { bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-700',  defaultIcon: '🔮' },
}

const config = computed(() => configs[props.variant] ?? configs.info)
const resolvedIcon = computed(() => props.icon ?? config.value.defaultIcon)

import { computed } from 'vue'
</script>

<template>
  <div
    class="callout"
    :class="[config.bg, config.border, config.text]"
  >
    <span v-if="!noIcon" class="callout-icon" aria-hidden="true">{{ resolvedIcon }}</span>
    <div class="callout-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border-width: 1px;
  border-style: solid;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.85em;
  line-height: 1.55;
}

.callout-icon {
  font-size: 1.1em;
  line-height: 1;
  margin-top: 1px;
  flex-shrink: 0;
}

.callout-body {
  min-width: 0;
}

:slotted(strong),
:slotted(b) {
  color: inherit;
}
</style>
