<script setup lang="ts">
import { computed } from 'vue'

type Accent = 'blue' | 'red' | 'orange' | 'gray'

const props = withDefaults(
  defineProps<{
    label: string
    title?: string
    accent?: Accent
    shadowSize?: number
  }>(),
  {
    accent: 'gray',
    shadowSize: 6,
  },
)

const ACCENT = {
  blue: {
    borderRgb: '191 219 254',
    chipBg: 'bg-blue-50',
    chipText: 'text-blue-700',
    chipBorder: 'border-blue-200',
  },
  red: {
    borderRgb: '254 202 202',
    chipBg: 'bg-red-50',
    chipText: 'text-red-700',
    chipBorder: 'border-red-200',
  },
  orange: {
    borderRgb: '254 215 170',
    chipBg: 'bg-orange-50',
    chipText: 'text-orange-700',
    chipBorder: 'border-orange-200',
  },
  gray: {
    borderRgb: '229 231 235',
    chipBg: 'bg-gray-50',
    chipText: 'text-gray-700',
    chipBorder: 'border-gray-200',
  },
} satisfies Record<Accent, { borderRgb: string; chipBg: string; chipText: string; chipBorder: string }>

const theme = computed(() => ACCENT[props.accent])
</script>

<template>
  <div
    class="relative h-full rounded-2xl bg-white p-4 pt-9 border flex flex-col"
    :style="{
      '--color-border': `rgb(${theme.borderRgb})`,
      boxShadow: `${shadowSize}px ${shadowSize}px 0 var(--color-border)`,
      borderColor: 'var(--color-border)',
    }"
  >
    <span
      class="absolute left-3 top-3 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-lg border"
      :class="[theme.chipBg, theme.chipText, theme.chipBorder]"
    >
      {{ label }}
    </span>

    <div class="text-3xl mb-2">
      <slot name="icon" />
    </div>

    <div v-if="title" class="font-bold text-gray-900">
      {{ title }}
    </div>

    <div class="text-sm text-gray-600 mt-1 flex-1">
      <slot />
    </div>
  </div>
</template>

