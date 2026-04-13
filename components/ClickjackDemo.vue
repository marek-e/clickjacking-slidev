<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  victimUrl:      { type: String, required: true },
  victimLabel:    { type: String, default: 'Victim page' },
  attackerTitle:  { type: String, default: '🎉 Congratulations!' },
  attackerBody:   { type: String, default: 'You have been selected as today\'s lucky winner.' },
  attackerButton: { type: String, default: 'Claim Your Prize' },
  height:         { type: Number, default: 260 },
})

const revealOpacity = ref(0)

const statusLabel = computed(() => {
  if (revealOpacity.value === 0)   return '⚠️ Attack in progress — victim iframe is invisible'
  if (revealOpacity.value === 100) return '✅ Fully revealed — this is what you\'re really clicking'
  return `Partially revealed (${revealOpacity.value}%)`
})
</script>

<template>
  <div class="cj-wrapper">

    <!-- ── Stage ─────────────────────────────────────────── -->
    <div class="cj-stage" :style="{ height: height + 'px' }">

      <!-- Bottom layer: attacker's page (always visible) -->
      <div class="cj-attacker">
        <span class="cj-badge">ATTACKER PAGE</span>
        <div class="cj-attacker-title">{{ attackerTitle }}</div>
        <p class="cj-attacker-body">{{ attackerBody }}</p>
        <button class="cj-attacker-btn" tabindex="-1">{{ attackerButton }}</button>
      </div>

      <!-- Top layer: victim iframe (opacity controlled) -->
      <iframe
        class="cj-victim"
        :src="victimUrl"
        :style="{ opacity: revealOpacity / 100 }"
      />

      <!-- Opacity label overlay -->
      <div class="cj-opacity-badge" :style="{ opacity: revealOpacity > 0 ? 1 : 0 }">
        victim layer {{ revealOpacity }}%
      </div>
    </div>

    <!-- ── Controls ───────────────────────────────────────── -->
    <div class="cj-controls">
      <div class="cj-slider-row">
        <span class="cj-lbl-attack">👁️ Attack view</span>
        <input
          type="range"
          class="cj-slider"
          min="0" max="100" step="1"
          v-model.number="revealOpacity"
        />
        <span class="cj-lbl-reveal">🔍 Revealed</span>
      </div>
      <div class="cj-status">{{ statusLabel }}</div>
    </div>

    <!-- ── Legend ─────────────────────────────────────────── -->
    <div class="cj-legend">
      <span class="cj-dot dot-attacker"></span>
      <span>Attacker's page (always visible to the user)</span>
      <span class="cj-dot dot-victim"></span>
      <span>{{ victimLabel }} — transparent <code>iframe</code> layered on top</span>
    </div>

  </div>
</template>

<style scoped>
/* ── Wrapper ────────────────────────────────────────────── */
.cj-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  font-size: 0.82em;
}

/* ── Stage ──────────────────────────────────────────────── */
.cj-stage {
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #d1d5db;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* Attacker layer (z-index 1, always opaque) */
.cj-attacker {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: #fff;
}

.cj-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ff4444;
  color: #fff;
  font-size: 0.68em;
  font-weight: 700;
  letter-spacing: 0.6px;
  padding: 2px 8px;
  border-radius: 4px;
}

.cj-attacker-title {
  font-size: 1.35em;
  font-weight: 700;
  color: #ffd700;
}

.cj-attacker-body {
  color: #bbb;
  max-width: 340px;
  line-height: 1.4;
}

.cj-attacker-btn {
  padding: 11px 30px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(40, 167, 69, 0.45);
  pointer-events: none; /* demo only — clicking does nothing */
}

/* Victim iframe (z-index 2, opacity controlled) */
.cj-victim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 2;
  transition: opacity 0.06s linear;
}

/* Small overlay badge showing current opacity */
.cj-opacity-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 3;
  background: rgba(0, 0, 0, 0.65);
  color: #64b5f6;
  font-size: 0.7em;
  padding: 2px 8px;
  border-radius: 4px;
  pointer-events: none;
  transition: opacity 0.2s;
}

/* ── Controls ───────────────────────────────────────────── */
.cj-controls {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cj-slider-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cj-lbl-attack { color: #dc2626; white-space: nowrap; }
.cj-lbl-reveal { color: #16a34a; white-space: nowrap; }

.cj-slider {
  flex: 1;
  accent-color: #7c3aed;
  cursor: pointer;
  height: 4px;
}

.cj-status {
  text-align: center;
  font-size: 0.78em;
  color: #6b7280;
  font-style: italic;
}

/* ── Legend ─────────────────────────────────────────────── */
.cj-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7em;
  color: #4b5563;
  flex-wrap: wrap;
}

.cj-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.dot-attacker { background: #d97706; margin-left: 8px; }
.dot-attacker:first-child { margin-left: 0; }
.dot-victim   { background: #64b5f6; }
</style>
