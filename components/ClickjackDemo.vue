<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  victimUrl: { type: String, required: true },
  victimLabel: { type: String, default: "Victim page" },
  attackerTitle: { type: String, default: "🎉 Congratulations!" },
  attackerBody: {
    type: String,
    default: "You have been selected as today's lucky winner.",
  },
  attackerButton: { type: String, default: "Claim Your Prize" },
  height: { type: Number, default: 260 },
  showPositionControls: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  startX: { type: Number, default: 0 },
  startY: { type: Number, default: 0 },
  adMode: { type: Boolean, default: false },
  adHeader: { type: String, default: "" },
  adHeaderBg: { type: String, default: "#6366f1" },
  attackerBg: { type: String, default: "" },
});

const emit = defineEmits(["buttonClick"]);

const revealOpacity = ref(0);
const iframeTop = ref(props.startY);
const iframeLeft = ref(props.startX);

const iframeStyle = computed(() => ({
  opacity: revealOpacity.value / 100,
  top: `${iframeTop.value}px`,
  left: `${iframeLeft.value}px`,
  right: "auto",
  bottom: "auto",
  width: "100%",
  height: "100%",
}));

function onWindowBlur() {
  emit("buttonClick");
}

watch(
  () => props.clickable,
  (val) => {
    if (val) window.addEventListener("blur", onWindowBlur, { once: true });
    else window.removeEventListener("blur", onWindowBlur);
  },
  { immediate: true },
);

onUnmounted(() => window.removeEventListener("blur", onWindowBlur));

const attackerBgStyle = computed(() =>
  props.attackerBg ? { background: props.attackerBg } : {},
);

const statusLabel = computed(() => {
  if (revealOpacity.value === 0)
    return "⚠️ Attack in progress — victim iframe is invisible";
  if (revealOpacity.value === 100)
    return "✅ Fully revealed — this is what you're really clicking";
  return `Partially revealed (${revealOpacity.value}%)`;
});
</script>

<template>
  <div class="cj-wrapper">
    <!-- ── Stage ─────────────────────────────────────────── -->
    <div class="cj-stage" :style="{ height: height + 'px' }">
      <!-- Bottom layer: attacker's page (always visible) -->

      <!-- Default full-page layout -->
      <div v-if="!adMode" class="cj-attacker" :style="attackerBgStyle">
        <span class="cj-badge">ATTACKER PAGE</span>
        <div class="cj-attacker-title">{{ attackerTitle }}</div>
        <p class="cj-attacker-body">{{ attackerBody }}</p>
        <button class="cj-attacker-btn" tabindex="-1">
          {{ attackerButton }}
        </button>
      </div>

      <!-- Ad popup layout: dimmed background + floating card -->
      <div v-else class="cj-attacker cj-ad-scene" :style="attackerBgStyle">
        <span class="cj-badge">ATTACKER PAGE</span>
        <div class="cj-ad-overlay" aria-hidden="true"></div>
        <div class="cj-ad-popup">
          <!-- Popup header -->
          <div class="cj-ad-header" :style="{ background: adHeaderBg }">
            <span v-if="adHeader" class="cj-ad-brand">{{ adHeader }}</span>
            <span v-else class="cj-ad-brand">Advertisement</span>
            <button class="cj-ad-close" tabindex="-1">×</button>
          </div>
          <!-- Popup body -->
          <div class="cj-ad-body">
            <div class="cj-attacker-title">{{ attackerTitle }}</div>
            <p class="cj-attacker-body">{{ attackerBody }}</p>
            <button class="cj-attacker-btn" tabindex="-1">
              {{ attackerButton }}
            </button>
          </div>
        </div>
      </div>

      <!-- Top layer: victim iframe (opacity + position controlled) -->
      <iframe class="cj-victim" :src="victimUrl" :style="iframeStyle" />

      <!-- Opacity label overlay -->
      <div
        class="cj-opacity-badge"
        :style="{ opacity: revealOpacity > 0 ? 1 : 0 }"
      >
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
          min="0"
          max="100"
          step="1"
          v-model.number="revealOpacity"
        />
        <span class="cj-lbl-reveal">🔍 Revealed</span>
      </div>
      <div class="cj-status">{{ statusLabel }}</div>

      <!-- Position controls (opt-in) -->
      <div v-if="showPositionControls" class="cj-pos-controls">
        <div class="cj-pos-sliders">
          <div class="cj-pos-row">
            <span class="cj-pos-lbl">top</span>
            <input
              type="range"
              class="cj-slider"
              min="-200"
              max="200"
              step="1"
              v-model.number="iframeTop"
            />
            <span class="cj-pos-val">{{ iframeTop }}px</span>
          </div>
          <div class="cj-pos-row">
            <span class="cj-pos-lbl">left</span>
            <input
              type="range"
              class="cj-slider"
              min="-300"
              max="300"
              step="1"
              v-model.number="iframeLeft"
            />
            <span class="cj-pos-val">{{ iframeLeft }}px</span>
          </div>
        </div>
        <pre class="cj-pos-code">
iframe {
  position: absolute;
  opacity: 0.001;
  top:  {{ iframeTop }}px;
  left: {{ iframeLeft }}px;
}</pre
        >
      </div>
    </div>

    <!-- ── Legend ─────────────────────────────────────────── -->
    <div class="cj-legend">
      <span class="cj-dot dot-attacker"></span>
      <span>Attacker's page (always visible to the user)</span>
      <span class="cj-dot dot-victim"></span>
      <span
        >{{ victimLabel }} — transparent <code>iframe</code> layered on
        top</span
      >
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
  pointer-events: none;
  transition:
    transform 0.12s,
    box-shadow 0.12s;
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

.cj-lbl-attack {
  color: #dc2626;
  white-space: nowrap;
}
.cj-lbl-reveal {
  color: #16a34a;
  white-space: nowrap;
}

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

/* ── Position controls ──────────────────────────────────── */
.cj-pos-controls {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 6px;
  padding: 8px 10px;
  background: #0f172a;
  border-radius: 8px;
  border: 1px solid #1e293b;
}

.cj-pos-sliders {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cj-pos-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cj-pos-lbl {
  font-family: monospace;
  font-size: 0.8em;
  color: #38bdf8;
  width: 28px;
  flex-shrink: 0;
}

.cj-pos-val {
  font-family: monospace;
  font-size: 0.8em;
  color: #a3e635;
  width: 52px;
  text-align: right;
  flex-shrink: 0;
}

.cj-pos-code {
  margin: 0;
  padding: 6px 10px;
  background: #1e293b;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.72em;
  color: #e2e8f0;
  line-height: 1.6;
  white-space: pre;
  flex-shrink: 0;
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

.dot-attacker {
  background: #d97706;
  margin-left: 8px;
}
.dot-attacker:first-child {
  margin-left: 0;
}
.dot-victim {
  background: #64b5f6;
}

/* ── Ad popup mode ───────────────────────────────────────── */

/* Outer scene: the "website" behind the popup */
.cj-ad-scene {
  background: linear-gradient(150deg, #0d1117 0%, #161b22 100%);
}

/* Semi-transparent overlay that dims the background */
.cj-ad-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 0;
}

/* Floating popup card */
.cj-ad-popup {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  width: min(320px, 88%);
  display: flex;
  flex-direction: column;
}

/* Popup header strip: brand name + × */
.cj-ad-header {
  display: flex;
  align-items: center;
  padding: 8px 10px 8px 14px;
  gap: 8px;
  flex-shrink: 0;
}

.cj-ad-brand {
  flex: 1;
  font-size: 0.78em;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}

.cj-ad-close {
  width: 22px;
  height: 22px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  font-size: 1em;
  line-height: 1;
  cursor: pointer;
  pointer-events: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-family: inherit;
  flex-shrink: 0;
}

/* Popup body */
.cj-ad-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 20px 20px;
  text-align: center;
}

.cj-ad-scene .cj-attacker-title {
  color: #1e293b;
  font-size: 1.1em;
}
.cj-ad-scene .cj-attacker-body {
  color: #475569;
}
.cj-ad-scene .cj-badge {
  z-index: 2;
}
</style>
